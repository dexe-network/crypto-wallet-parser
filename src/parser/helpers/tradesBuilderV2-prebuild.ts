import BigNumber from 'bignumber.js';
import moment from 'moment';
import config from '../../constants/defaultConfig';
import { IGroupedTransactions, ITokenBalanceInfo, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
import lodash from 'lodash';
import {
  balanceDifferencesResult,
  IAppTokenInfo,
  IOperationAmount,
  IOperationTokens,
  TradeStatus,
  TradeType,
} from '../../interfaces/parser/tradesBuilderV2.interface';
import { parsedBalanceToRaw } from '../../helpers/tokens.helper';
import { stableCoinList } from '../../constants/stableCoins';
import { IParserClientConfig, IServices } from '../../interfaces';
import { generateBehaviourConfig, ITradesBuilderV2BehaviourConfig } from '../configs/tradesBuilderV2.configs';
import { ethDefaultInfo } from '../../constants/tokenInfo';
import {
  IPrebuildOperationItemBase,
  IPrebuildTradeEvent,
  IPrebuildTradeItem,
  IPrebuildTradeIterateItem,
  IPrebuildTradeIterateObject,
} from '../../interfaces/parser/tradesBuilderV2-prebuild.interface';

export class TradesBuilderV2Prebuild {
  private behaviourConfig: ITradesBuilderV2BehaviourConfig;

  constructor(private services: IServices, private config: IParserClientConfig) {
    this.behaviourConfig = generateBehaviourConfig(config);
  }

  public async buildTrades(data: IGroupedTransactions<ITokenBalanceItemBase>[]): Promise<IPrebuildTradeIterateObject> {
    const rawResult = await this.behaviourIterator(data);

    const openTrades = Object.values(rawResult)
      .map((x) => x.trades[x.trades.length - 1])
      .filter((x) => x.tradeStatus === TradeStatus.OPEN);

    let withVirtualTrades;
    if (openTrades.length > 0) {
      const virtualTrade = await this.generateVirtualTrades(openTrades, data[data.length - 1]);
      withVirtualTrades = await this.behaviourIterator(virtualTrade, rawResult);
    }

    return withVirtualTrades ? withVirtualTrades : rawResult;
  }

  private async generateVirtualTrades(
    openTrades: IPrebuildTradeItem[],
    lastGroupedTransaction: IGroupedTransactions<ITokenBalanceItemBase>,
  ): Promise<IGroupedTransactions<ITokenBalanceItemBase>[]> {
    try {
      const currentBlockNumber = await this.services.web3Service.getCurrentBlockNumberLimiter();
      return this.generateVirtualTransactions(openTrades, lastGroupedTransaction, currentBlockNumber);
    } catch (e) {
      throw e;
    }
  }

  private generateVirtualTransactions(
    openTrades: IPrebuildTradeItem[],
    lastGroupedTransaction: IGroupedTransactions<ITokenBalanceItemBase>,
    currentBlockNumber: number,
  ): IGroupedTransactions<ITokenBalanceItemBase>[] {
    return openTrades.reduce<IGroupedTransactions<ITokenBalanceItemBase>[]>((accum, value, index) => {
      const balanceBeforeTransaction = lastGroupedTransaction.balance;
      const result = {
        normalTransactions: [],
        internalTransactions: [],
        erc20Transactions: [],
        erc721Transactions: [],
        balanceBeforeTransaction: balanceBeforeTransaction,
        balance: this.generateBalanceDiffForVirtualTradePnl(value, balanceBeforeTransaction),
        blockNumber: currentBlockNumber - 10,
        previousTransactionBlockNumber: lastGroupedTransaction.blockNumber,
        feeInETH: new BigNumber(0),
        isVirtualTransaction: true,
        hash: `AUTO_CLOSE_TRADE_TRANSACTION ${index + 1}`,
        timeStamp: moment().unix().toString(),
      };
      accum.push(result);
      return accum;
    }, []);
  }

  private generateBalanceDiffForVirtualTradePnl(
    trade: IPrebuildTradeItem,
    balance: ITokenBalanceInfo<ITokenBalanceItemBase>,
  ): ITokenBalanceInfo<ITokenBalanceItemBase> {
    return {
      // Deep clone balance
      ...Object.values(balance).reduce((accum, value) => {
        accum[value.address] = {
          symbol: value.symbol,
          name: value.name,
          address: value.address,
          decimals: value.decimals,
          amount: value.amount.negated().negated(),
        };
        return accum;
      }, {} as ITokenBalanceInfo<ITokenBalanceItemBase>),
      [trade.tokenAddress]: {
        symbol: balance[trade.tokenAddress].symbol,
        name: balance[trade.tokenAddress].name,
        address: balance[trade.tokenAddress].address,
        decimals: balance[trade.tokenAddress].decimals,
        amount: balance[trade.tokenAddress].amount.minus(trade.balance),
      },
    };
  }

  private async behaviourIterator(
    data: IGroupedTransactions<ITokenBalanceItemBase>[],
    initValue = {},
  ): Promise<IPrebuildTradeIterateObject> {
    // console.log('behaviourIterator', data.length);
    return data.reduce<Promise<IPrebuildTradeIterateObject>>(async (accumulatorValuePromise, currentItem, index) => {
      const accumulatorValue = await accumulatorValuePromise;
      // Catch and Skip Error transaction
      if (this.isErrorTransaction(currentItem)) {
        return accumulatorValue;
      }
      const state = await this.getTokenOperationState(currentItem);

      if (state.isTrustedProvider) {
        // Uniswap transaction
        for (const operation of state.operations) {
          if (operation.amount.isGreaterThan(0)) {
            // Income event (Open trade or Rebuy open position)
            this.calculateIncomeEvent(accumulatorValue, operation, state, currentItem.balanceBeforeTransaction);
          } else {
            this.calculateOutgoingEvent(accumulatorValue, operation, state, currentItem.balanceBeforeTransaction);
          }
        }
      } else {
        // Other transaction
        for (const operation of state.operations) {
          if (operation.amount.isLessThanOrEqualTo(0)) {
            // Income event (Open trade or Rebuy open position)
            this.calculateOutgoingEvent(accumulatorValue, operation, state, currentItem.balanceBeforeTransaction);
          }
        }
      }

      return accumulatorValue;
    }, Promise.resolve(initValue));
  }

  private calculateOutgoingEvent(
    accumulatorValue: IPrebuildTradeIterateObject,
    operation: IOperationAmount,
    state: IPrebuildOperationItemBase,
    balanceBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>,
  ): void {
    const openTradeIndex = (accumulatorValue[operation.address]?.trades || []).findIndex(
      (x) => x.tradeStatus === TradeStatus.OPEN,
    );
    if (openTradeIndex >= 0) {
      this.calculateOperationWithOpenTrade(
        operation,
        state,
        accumulatorValue[operation.address],
        openTradeIndex,
        balanceBeforeTransaction,
      );
    }
  }

  private calculateIncomeEvent(
    accumulatorValue: IPrebuildTradeIterateObject,
    operation: IOperationAmount,
    state: IPrebuildOperationItemBase,
    balanceBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>,
  ): void {
    if (accumulatorValue[operation.address]) {
      const openTradeIndex = accumulatorValue[operation.address].trades.findIndex(
        (x) => x.tradeStatus === TradeStatus.OPEN,
      );
      if (openTradeIndex >= 0) {
        this.calculateOperationWithOpenTrade(
          operation,
          state,
          accumulatorValue[operation.address],
          openTradeIndex,
          balanceBeforeTransaction,
        );
      } else {
        accumulatorValue[operation.address].trades.push(this.openNewTrade(state, operation, balanceBeforeTransaction));
      }
    } else {
      accumulatorValue[operation.address] = {
        tokenAddress: operation.address,
        trades: [this.openNewTrade(state, operation, balanceBeforeTransaction)],
      };
    }
  }

  private calculateOperationWithOpenTrade(
    operation: IOperationAmount,
    state: IPrebuildOperationItemBase,
    data: IPrebuildTradeIterateItem,
    openTradeIndex: number,
    balanceBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>,
  ): void {
    const tradeEvent = this.createNewTradeEvent(
      state,
      operation,
      balanceBeforeTransaction,
      data.trades[openTradeIndex],
    );
    data.trades[openTradeIndex].balance = data.trades[openTradeIndex].balance.plus(operation.amount);
    data.trades[openTradeIndex].tradeEvents.push(tradeEvent);

    if (tradeEvent.tradeType === TradeType.SELL) {
      this.createIterateSellEvents(tradeEvent, data, openTradeIndex);
    }

    if (data.trades[openTradeIndex].balance.isLessThanOrEqualTo(0)) {
      data.trades[openTradeIndex].tradeStatus = TradeStatus.CLOSE;
      data.trades[openTradeIndex].closeTimeStamp = state.timeStamp;
    }
  }

  private createIterateSellEvents(
    tradeEvent: IPrebuildTradeEvent,
    data: IPrebuildTradeIterateItem,
    openTradeIndex: number,
  ): void {
    let sellOperationAmount = tradeEvent.amount.negated();
    // write sell event from buy
    for (const [index, value] of data.trades[openTradeIndex].tradeEvents.entries()) {
      if (value.tradeType === TradeType.BUY && value.balance.isGreaterThan(0)) {
        const amountResult = value.balance.minus(sellOperationAmount);
        if (amountResult.isGreaterThanOrEqualTo(0)) {
          value.balance = value.balance.minus(sellOperationAmount);
          const operation = {
            sellTransactionHash: tradeEvent.transactionHash,
            amount: new BigNumber(sellOperationAmount.toString()),
            profit: {
              usd: new BigNumber(0),
              eth: new BigNumber(0),
            },
            profitLoss: {
              usd: new BigNumber(0),
              eth: new BigNumber(0),
            },
            tokenInfo: tradeEvent.tokenInfo,
          };
          value.sellOperations.push(operation);
          tradeEvent.sellOperations.push(operation);
          sellOperationAmount = new BigNumber(0);
          break;
        } else {
          if (value.balance.isGreaterThan(0)) {
            const operation = {
              sellTransactionHash: tradeEvent.transactionHash,
              amount: new BigNumber(value.balance.toString()),
              profit: {
                usd: new BigNumber(0),
                eth: new BigNumber(0),
              },
              profitLoss: {
                usd: new BigNumber(0),
                eth: new BigNumber(0),
              },
              tokenInfo: tradeEvent.tokenInfo,
            };
            value.sellOperations.push(operation);
            tradeEvent.sellOperations.push(operation);
            sellOperationAmount = sellOperationAmount.minus(value.balance);
            value.balance = new BigNumber(0);
          }
        }
      }
    }
  }

  private openNewTrade(
    state: IPrebuildOperationItemBase,
    operation: IOperationAmount,
    balanceBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>,
  ): IPrebuildTradeItem {
    return {
      balance: new BigNumber(operation.amount),
      startDep: { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0) },
      tokenAddress: operation.address,
      spendingUSD: new BigNumber(0),
      spendingETH: new BigNumber(0),
      incomeUSD: new BigNumber(0),
      incomeETH: new BigNumber(0),
      tradeStatus: TradeStatus.OPEN,
      tradeEvents: [this.createNewTradeEvent(state, operation, balanceBeforeTransaction)],
      openTimeStamp: state.timeStamp,
      profitLossFromUSD: new BigNumber(0),
      profitLossFromETH: new BigNumber(0),
      profitFromUSD: new BigNumber(0),
      profitFromETH: new BigNumber(0),
      points: new BigNumber(0),
    };
  }

  private createNewTradeEvent(
    state: IPrebuildOperationItemBase,
    operation: IOperationAmount,
    balanceBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>,
    trade?: IPrebuildTradeItem,
  ): IPrebuildTradeEvent {
    const startDep = { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0) };
    const tokenInfo = this.createTokenInfo(operation);
    const tradeType = this.tradeTypeSwitcher(operation.amount);
    const price = {
      raw: {
        usd: new BigNumber(0),
        eth: new BigNumber(0),
      },
      withFee: {
        usd: new BigNumber(0),
        eth: new BigNumber(0),
      },
    };

    return {
      tradeType,
      amount: new BigNumber(operation.amount),
      balance: tradeType === TradeType.BUY ? new BigNumber(operation.amount) : new BigNumber(0),
      averageStartDep: {
        usd: new BigNumber(0),
        eth: new BigNumber(0),
      },
      tokenInfo,
      sellOperations: [],
      isVirtualTransaction: state.isVirtualTransaction,
      transactionHash: state.transactionHash,
      timeStamp: state.timeStamp,
      costUSD: new BigNumber(0),
      costETH: new BigNumber(0),
      transactionFeeETH: new BigNumber(0),
      transactionFeeUSD: new BigNumber(0),
      price,
      startDep,
      operationInfo: state.operationInfo,
      balances: state.balances,
      balancesBeforeTransaction: state.balancesBeforeTransaction,
      blockNumber: state.blockNumber,
    };
  }

  private createTokenInfo(operation: IOperationAmount): IAppTokenInfo {
    return {
      symbol: operation.symbol,
      name: operation.name,
      address: operation.address,
      decimals: operation.decimals,
    };
  }

  private tradeTypeSwitcher(amount: BigNumber): TradeType {
    if (amount.isGreaterThan(0)) {
      return TradeType.BUY;
    } else {
      return TradeType.SELL;
    }
  }

  private isErrorTransaction(data: IGroupedTransactions<ITokenBalanceItemBase>) {
    if (
      [
        ...(data.normalTransactions || []),
        ...(data.internalTransactions || []),
        ...(data.erc20Transactions || []),
        ...(data.erc721Transactions || []),
      ].some((x) => x?.isError === '1')
    ) {
      return true;
    }
    return false;
  }

  private async getTokenOperationState(
    currentData: IGroupedTransactions<ITokenBalanceItemBase>,
  ): Promise<IPrebuildOperationItemBase> {
    try {
      let state: IPrebuildOperationItemBase;
      const balancesDifferencesData = this.balanceDifferences(
        currentData.balance,
        currentData.balanceBeforeTransaction,
        currentData.feeInETH,
      );

      if (
        currentData.normalTransactions &&
        currentData.normalTransactions[0]?.to?.toLowerCase() === config.uniswap.uniswapRouterAddress
      ) {
        const normalTransaction = currentData.normalTransactions[0];
        // Catch Only correct Uniswap Swaps (for trades) Exclude add or remove from liquidity
        // Catch add or remove from liquidity Uniswap
        // !!! Prebuild trades in some cases can incorrect build pre trades, because
        // we can't detect remove liqudity and add to liquidity without request for uni transaction info
        state = {
          isVirtualTransaction: currentData.isVirtualTransaction,
          operations: balancesDifferencesData.differences,
          operationInfo: balancesDifferencesData.operationInfo,
          isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.first,
          timeStamp: normalTransaction.timeStamp,
          transactionHash: normalTransaction.hash,
          balances: currentData.balance,
          balancesBeforeTransaction: currentData.balanceBeforeTransaction,
          blockNumber: currentData.blockNumber,
        };
      } else {
        state = {
          isVirtualTransaction: currentData.isVirtualTransaction,
          operations: balancesDifferencesData.differences,
          operationInfo: balancesDifferencesData.operationInfo,
          isTrustedProvider: this.behaviourConfig.isTrustedProviderPattern.third,
          timeStamp: currentData.timeStamp,
          transactionHash: currentData.hash,
          balances: currentData.balance,
          balancesBeforeTransaction: currentData.balanceBeforeTransaction,
          blockNumber: currentData.blockNumber,
        };
      }

      return state;
    } catch (e) {
      throw e;
    }
  }

  private balanceDifferences(
    currentBalance: ITokenBalanceInfo<ITokenBalanceItemBase>,
    beforeBalance: ITokenBalanceInfo<ITokenBalanceItemBase>,
    parsedFeeInETH: BigNumber,
  ): balanceDifferencesResult {
    const tokensAddress = lodash.uniq([...Object.keys(currentBalance), ...Object.keys(beforeBalance)]);
    const diffs: IOperationAmount[] = [];
    const operationInfo: IOperationTokens = {
      sent: [],
      received: [],
    };
    for (const key of tokensAddress) {
      if (
        currentBalance[key]?.amount &&
        !(currentBalance[key].amount.toString() === beforeBalance[key]?.amount?.toString())
      ) {
        const item = {
          symbol: currentBalance[key].symbol,
          name: currentBalance[key].name,
          address: currentBalance[key].address.toLowerCase(),
          decimals: currentBalance[key].decimals,
          amount: beforeBalance[key]?.amount
            ? currentBalance[key].amount.minus(beforeBalance[key].amount)
            : new BigNumber(currentBalance[key].amount.toString()),
        };

        // Exclude Fee From Balance Differences
        if (item.address === ethDefaultInfo.address) {
          if (item.amount.isLessThan(0)) {
            item.amount = item.amount.plus(parsedBalanceToRaw(parsedFeeInETH, +ethDefaultInfo.decimals));
          }

          if (item.amount.isGreaterThan(0)) {
            item.amount = item.amount.minus(parsedBalanceToRaw(parsedFeeInETH, +ethDefaultInfo.decimals));
          }
        }

        // set operationInfo
        if (item.amount.isLessThan(0)) {
          operationInfo.sent.push(item);
        }
        if (item.amount.isGreaterThan(0)) {
          operationInfo.received.push(item);
        }

        diffs.push(item);
      }
    }

    return {
      differences: diffs.filter((x) => !stableCoinList.some((y) => y.address === x.address.toLowerCase())),
      operationInfo,
    };
  }
}
