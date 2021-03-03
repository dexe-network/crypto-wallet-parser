import config from '../../../../config';
import BigNumber from 'bignumber.js';
import UniswapService from '../../services/outgoing/uniswap/uniswap.service';
import moment from 'moment';
import { IGroupedTransactions, ITokenBalanceInfo } from '../../interfaces/etherscan.interfaces';
import lodash from 'lodash';
import {
  IAppTokenInfo,
  IAverageStartDep,
  IEventTokenPrice,
  IOperationAmount,
  IOperationItem,
  IOperationPrice,
  IStartDep,
  ITradeEvent,
  ITradeItem,
  ITradeIterateItem,
  ITradeIterateObject,
  TradeStatus,
  TradeType,
} from '../../interfaces/parser/tradesBuilderV2.interface';
import { IUniswapRawTransaction } from '../../interfaces/uniswap.interfaces';
import { buildBalanceTransformer } from '../../helpers/tokens.helper';
import { CalculateTransaction } from './calculateTransaction';
import { stableCoinList } from '../../constants/stableCoins';
import Web3Service from '../../services/helpers/web3.service';
import { ParseTransaction } from './parseTransaction';

export class TradesBuilderV2 {
  private uniswapService: UniswapService;
  private calculateTransaction: CalculateTransaction;
  private web3Service: Web3Service;
  private parseTransactionWallet: ParseTransaction;

  constructor() {
    this.uniswapService = Container.get(UniswapService);
    this.web3Service = Container.get(Web3Service);
    this.calculateTransaction = new CalculateTransaction();
    this.parseTransactionWallet = new ParseTransaction();
  }

  public async buildTrades(data: IGroupedTransactions[]): Promise<ITradeIterateObject> {
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
    openTrades: ITradeItem[],
    lastGroupedTransaction: IGroupedTransactions,
  ): Promise<IGroupedTransactions[]> {
    try {
      const currentBlockNumber = await this.web3Service.getCurrentBlockNumberLimiter();
      return await this.parseTransactionWallet.parseTransactionBalancePrice(
        this.generateVirtualTransactions(openTrades, lastGroupedTransaction, currentBlockNumber),
      );
    } catch (e) {
      throw e;
    }
  }

  private generateVirtualTransactions(
    openTrades: ITradeItem[],
    lastGroupedTransaction: IGroupedTransactions,
    currentBlockNumber: number,
  ): IGroupedTransactions[] {
    return openTrades.reduce<IGroupedTransactions[]>((accum, value, index) => {
      const balanceBeforeTransaction = index === 0 ? lastGroupedTransaction.balance : accum[index - 1].balance;
      const result = {
        normalTransactions: undefined,
        internalTransactions: undefined,
        erc20Transactions: undefined,
        erc721Transactions: undefined,
        balanceBeforeTransaction: balanceBeforeTransaction,
        balance: this.generateBalanceDiffForVirtualTradePnl(value, balanceBeforeTransaction),
        blockNumber: currentBlockNumber - 10,
        previousTransactionBlockNumber: lastGroupedTransaction.blockNumber,
        feeInETH: new BigNumber(0),
        hash: `AUTO_CLOSE_TRADE_TRANSACTION ${index + 1}`,
        timeStamp: moment().unix().toString(),
      };
      accum.push(result);
      return accum;
    }, []);
  }

  private generateBalanceDiffForVirtualTradePnl(trade: ITradeItem, balance: ITokenBalanceInfo): ITokenBalanceInfo {
    return {
      ...balance,
      [trade.tokenAddress]: {
        symbol: balance[trade.tokenAddress].symbol,
        name: balance[trade.tokenAddress].name,
        address: balance[trade.tokenAddress].address,
        decimals: balance[trade.tokenAddress].decimals,
        amount: balance[trade.tokenAddress].amount.minus(trade.balance),
      },
    };
  }

  private async behaviourIterator(data: IGroupedTransactions[], initValue = {}): Promise<ITradeIterateObject> {
    console.log('behaviourIterator', data.length);
    return data.reduce<Promise<ITradeIterateObject>>(async (accumulatorValuePromise, currentItem, index) => {
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
    accumulatorValue: ITradeIterateObject,
    operation: IOperationAmount,
    state: IOperationItem,
    balanceBeforeTransaction: ITokenBalanceInfo,
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
    accumulatorValue: ITradeIterateObject,
    operation: IOperationAmount,
    state: IOperationItem,
    balanceBeforeTransaction: ITokenBalanceInfo,
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
    state: IOperationItem,
    data: ITradeIterateItem,
    openTradeIndex: number,
    balanceBeforeTransaction: ITokenBalanceInfo,
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
      data.trades[openTradeIndex].incomeETH = data.trades[openTradeIndex].incomeETH.plus(state.amount.raw.ETH);
      data.trades[openTradeIndex].incomeUSD = data.trades[openTradeIndex].incomeUSD.plus(state.amount.raw.USD);
      // Write fee from sell to spending
      data.trades[openTradeIndex].spendingETH = data.trades[openTradeIndex].spendingETH.plus(state.transactionFeeETH);
      data.trades[openTradeIndex].spendingUSD = data.trades[openTradeIndex].spendingUSD.plus(state.transactionFeeUSD);

      this.createIterateSellEvents(tradeEvent, data, openTradeIndex);
    } else {
      data.trades[openTradeIndex].spendingETH = data.trades[openTradeIndex].spendingETH.plus(state.amount.withFee.ETH);
      data.trades[openTradeIndex].spendingUSD = data.trades[openTradeIndex].spendingUSD.plus(state.amount.withFee.USD);
    }

    const profit = this.calculateTransaction.calculateProfitLossOnAnyPosition(data.trades[openTradeIndex]);

    if (data.trades[openTradeIndex].balance.isLessThanOrEqualTo(0)) {
      data.trades[openTradeIndex].tradeStatus = TradeStatus.CLOSE;
      data.trades[openTradeIndex].closeTimeStamp = state.timeStamp;

      data.trades[openTradeIndex].profitLossFromUSD = profit.profitLoss.fromUSD;
      data.trades[openTradeIndex].profitLossFromETH = profit.profitLoss.fromETH;

      data.trades[openTradeIndex].profitFromUSD = profit.profit.fromUSD;
      data.trades[openTradeIndex].profitFromETH = profit.profit.fromETH;

      data.trades[openTradeIndex].points = this.calculateTransaction.points(
        data.trades[openTradeIndex].profitLossFromETH,
        data.trades[openTradeIndex].tokenAddress,
      );
    } else {
      data.trades[openTradeIndex].profitLossFromUSD = profit.profitLoss.fromUSD;
      data.trades[openTradeIndex].profitLossFromETH = profit.profitLoss.fromETH;

      data.trades[openTradeIndex].profitFromUSD = profit.profit.fromUSD;
      data.trades[openTradeIndex].profitFromETH = profit.profit.fromETH;

      data.trades[openTradeIndex].points = this.calculateTransaction.points(
        data.trades[openTradeIndex].profitLossFromETH,
        data.trades[openTradeIndex].tokenAddress,
      );
    }
  }

  private createIterateSellEvents(tradeEvent: ITradeEvent, data: ITradeIterateItem, openTradeIndex: number): void {
    let sellOperationAmount = tradeEvent.amount.negated();
    // write sell event from buy
    for (const [index, value] of data.trades[openTradeIndex].tradeEvents.entries()) {
      if (value.tradeType === TradeType.BUY && value.balance.isGreaterThan(0)) {
        const amountResult = value.balance.minus(sellOperationAmount);
        if (amountResult.isGreaterThanOrEqualTo(0)) {
          const profitUSD = tradeEvent.price.withFee.usd
            .minus(value.price.withFee.usd)
            .multipliedBy(buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));

          const profitETH = tradeEvent.price.withFee.eth
            .minus(value.price.withFee.eth)
            .multipliedBy(buildBalanceTransformer(sellOperationAmount, +tradeEvent.tokenInfo.decimals));

          value.balance = value.balance.minus(sellOperationAmount);
          value.sellOperations.push({
            amount: new BigNumber(sellOperationAmount.toString()),
            profit: {
              usd: profitUSD,
              eth: profitETH,
            },
            profitLoss: {
              usd: profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100),
              eth: profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100),
            },
            tokenInfo: tradeEvent.tokenInfo,
          });
          sellOperationAmount = new BigNumber(0);
          break;
        } else {
          if (value.balance.isGreaterThan(0)) {
            const profitUSD = tradeEvent.price.withFee.usd
              .minus(value.price.withFee.usd)
              .multipliedBy(buildBalanceTransformer(value.balance, +tradeEvent.tokenInfo.decimals));

            const profitETH = tradeEvent.price.withFee.eth
              .minus(value.price.withFee.eth)
              .multipliedBy(buildBalanceTransformer(value.balance, +tradeEvent.tokenInfo.decimals));

            value.sellOperations.push({
              amount: new BigNumber(value.balance.toString()),
              profit: {
                usd: profitUSD,
                eth: profitETH,
              },
              profitLoss: {
                usd: profitUSD.dividedBy(value.averageStartDep.usd).multipliedBy(100),
                eth: profitETH.dividedBy(value.averageStartDep.eth).multipliedBy(100),
              },
              tokenInfo: tradeEvent.tokenInfo,
            });
            sellOperationAmount = sellOperationAmount.minus(value.balance);
            value.balance = new BigNumber(0);
          }
        }
      }
    }
  }

  private openNewTrade(
    state: IOperationItem,
    operation: IOperationAmount,
    balanceBeforeTransaction: ITokenBalanceInfo,
  ): ITradeItem {
    return {
      balance: new BigNumber(operation.amount),
      startDep: this.getBalanceCost(balanceBeforeTransaction),
      tokenAddress: operation.address,
      spendingUSD: new BigNumber(state.amount.withFee.USD),
      spendingETH: new BigNumber(state.amount.withFee.ETH),
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

  private getBalanceCost(balance: ITokenBalanceInfo): IStartDep {
    return Object.values(balance).reduce(
      (accum, currentValue) => {
        accum.amountInETH = accum.amountInETH.plus(currentValue.amountInETH);
        accum.amountInUSD = accum.amountInUSD.plus(currentValue.amountInUSD);
        return accum;
      },
      { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0) },
    );
  }

  private createNewTradeEvent(
    state: IOperationItem,
    operation: IOperationAmount,
    balanceBeforeTransaction: ITokenBalanceInfo,
    trade?: ITradeItem,
  ): ITradeEvent {
    const startDep = this.getBalanceCost(balanceBeforeTransaction);
    const tokenInfo = this.createTokenInfo(operation);
    const tradeType = this.tradeTypeSwitcher(operation.amount);
    const price = this.calculateTokenEventPrice({
      amount: operation.amount,
      tokenInfo,
      state,
      tradeType,
    });

    return {
      tradeType,
      amount: new BigNumber(operation.amount),
      balance: tradeType === TradeType.BUY ? new BigNumber(operation.amount) : undefined,
      averageStartDep: tradeType === TradeType.BUY ? this.calculateAverageStartDep(trade, startDep, price) : undefined,
      tokenInfo,
      sellOperations: tradeType === TradeType.BUY ? [] : undefined,
      transactionHash: state.transactionHash,
      timeStamp: state.timeStamp,
      costUSD: new BigNumber(state.amount.raw.USD),
      costETH: new BigNumber(state.amount.raw.ETH),
      transactionFeeETH: state.transactionFeeETH,
      transactionFeeUSD: state.transactionFeeUSD,
      price,
      startDep,
    };
  }

  private calculateAverageStartDep(trade: ITradeItem, startDep: IStartDep, price: IEventTokenPrice): IAverageStartDep {
    if (!trade) {
      return {
        usd: startDep.amountInUSD,
        eth: startDep.amountInETH,
      };
    } else {
      return {
        usd: this.averageStartDepUSD(trade, startDep, price),
        eth: this.averageStartDepETH(trade, startDep, price),
      };
    }
  }

  private averageStartDepETH(trade: ITradeItem, startDep: IStartDep, price: IEventTokenPrice): BigNumber {
    const buyTotalCostETH = trade.tradeEvents
      .filter((value, index) => value.tradeType === TradeType.BUY)
      .reduce((accum, value) => {
        return accum.plus(
          buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.eth),
        );
      }, new BigNumber(0));

    const sellTotalCostETH = trade.tradeEvents
      .filter((value, index) => value.tradeType === TradeType.SELL)
      .reduce((accum, value) => {
        return accum.plus(
          buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(
            value.price.withFee.eth,
          ),
        );
      }, new BigNumber(0));

    const accumulatedTokens = trade.balance;

    const settlementBalance = trade.startDep.amountInETH
      .minus(buyTotalCostETH)
      .plus(sellTotalCostETH)
      .plus(
        buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(
          price.withFee.eth,
        ),
      );

    return startDep.amountInETH.minus(settlementBalance).plus(trade.startDep.amountInETH);
  }

  private averageStartDepUSD(trade: ITradeItem, startDep: IStartDep, price: IEventTokenPrice): BigNumber {
    const buyTotalCostUSD = trade.tradeEvents
      .filter((value, index) => value.tradeType === TradeType.BUY)
      .reduce((accum, value) => {
        return accum.plus(
          buildBalanceTransformer(value.amount, +value.tokenInfo.decimals).multipliedBy(value.price.withFee.usd),
        );
      }, new BigNumber(0));

    const sellTotalCostUSD = trade.tradeEvents
      .filter((value, index) => value.tradeType === TradeType.SELL)
      .reduce((accum, value) => {
        return accum.plus(
          buildBalanceTransformer(value.amount.negated(), +value.tokenInfo.decimals).multipliedBy(
            value.price.withFee.usd,
          ),
        );
      }, new BigNumber(0));

    const accumulatedTokens = trade.balance;

    const settlementBalance = trade.startDep.amountInUSD
      .minus(buyTotalCostUSD)
      .plus(sellTotalCostUSD)
      .plus(
        buildBalanceTransformer(accumulatedTokens, +trade.tradeEvents[0].tokenInfo.decimals).multipliedBy(
          price.withFee.usd,
        ),
      );

    return startDep.amountInUSD.minus(settlementBalance).plus(trade.startDep.amountInUSD);
  }

  private calculateTokenEventPrice({
    amount,
    tokenInfo,
    state,
    tradeType,
  }: {
    amount: BigNumber;
    tokenInfo: IAppTokenInfo;
    state: IOperationItem;
    tradeType: TradeType;
  }): IEventTokenPrice {
    const parsedAmount = amount.isGreaterThanOrEqualTo(0)
      ? buildBalanceTransformer(amount, +tokenInfo.decimals)
      : buildBalanceTransformer(amount.negated(), +tokenInfo.decimals);
    return {
      raw: {
        usd: state.amount.raw.USD.dividedBy(parsedAmount),
        eth: state.amount.raw.ETH.dividedBy(parsedAmount),
      },
      withFee: {
        usd:
          tradeType === TradeType.BUY
            ? state.amount.withFee.USD.dividedBy(parsedAmount)
            : state.amount.raw.USD.minus(state.transactionFeeUSD).dividedBy(parsedAmount),
        eth:
          tradeType === TradeType.BUY
            ? state.amount.withFee.ETH.dividedBy(parsedAmount)
            : state.amount.raw.ETH.minus(state.transactionFeeETH).dividedBy(parsedAmount),
      },
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

  private isErrorTransaction(data: IGroupedTransactions) {
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

  private async getTokenOperationState(currentData: IGroupedTransactions): Promise<IOperationItem> {
    try {
      let state: IOperationItem;
      const balancesDifferences = this.balanceDifferences(currentData.balance, currentData.balanceBeforeTransaction);

      if (
        currentData.normalTransactions &&
        currentData.normalTransactions[0].to.toLowerCase() === config.uniswap.uniswapRouterAddress
      ) {
        const normalTransaction = currentData.normalTransactions[0];
        const uniswapTransactionData = await this.uniswapService.getUniswapTransactionByIdLimiter(
          normalTransaction.hash,
          +normalTransaction.blockNumber,
        );

        // Catch Only correct Uniswap Swaps (for trades) Exclude add or remove from liquidity
        if (uniswapTransactionData) {
          const operationPriceUniRaw = this.operationPriceFromUniswap(uniswapTransactionData);
          const transactionFeeETH = currentData.feeInETH;
          const transactionFeeUSD = currentData.feeInETH.multipliedBy(uniswapTransactionData.ethPrice);
          const operationPriceIncludeFee = this.operationPriceWithFee(
            operationPriceUniRaw,
            transactionFeeETH,
            transactionFeeUSD,
          );
          state = {
            operations: balancesDifferences,
            amount: {
              raw: {
                ETH: operationPriceUniRaw.amountInETH,
                USD: operationPriceUniRaw.amountInUSD,
              },
              withFee: {
                ETH: operationPriceIncludeFee.amountInETH,
                USD: operationPriceIncludeFee.amountInUSD,
              },
            },
            isTrustedProvider: true,
            timeStamp: normalTransaction.timeStamp,
            transactionHash: normalTransaction.hash,
            transactionFeeETH,
            transactionFeeUSD,
          };
        } else {
          // Catch add or remove from liquidity Uniswap
          const operationPriceOtherRaw = this.operationPriceFromOtherSource(balancesDifferences, currentData.balance);
          const transactionFeeETH = currentData.feeInETH;
          const transactionFeeUSD = currentData.feeInETH.multipliedBy(operationPriceOtherRaw.usdPer1ETH);
          const operationPriceIncludeFee = this.operationPriceWithFee(
            operationPriceOtherRaw,
            transactionFeeETH,
            transactionFeeUSD,
          );
          state = {
            operations: balancesDifferences,
            amount: {
              raw: {
                ETH: operationPriceOtherRaw.amountInETH,
                USD: operationPriceOtherRaw.amountInUSD,
              },
              withFee: {
                ETH: operationPriceIncludeFee.amountInETH,
                USD: operationPriceIncludeFee.amountInUSD,
              },
            },
            isTrustedProvider: false,
            timeStamp: normalTransaction.timeStamp,
            transactionHash: normalTransaction.hash,
            transactionFeeETH,
            transactionFeeUSD,
          };
        }
      } else {
        const operationPriceOtherRaw = this.operationPriceFromOtherSource(balancesDifferences, currentData.balance);
        const transactionFeeETH = currentData.feeInETH;
        const transactionFeeUSD = currentData.feeInETH.multipliedBy(operationPriceOtherRaw.usdPer1ETH);
        const operationPriceIncludeFee = this.operationPriceWithFee(
          operationPriceOtherRaw,
          transactionFeeETH,
          transactionFeeUSD,
        );
        state = {
          operations: balancesDifferences,
          amount: {
            raw: {
              ETH: operationPriceOtherRaw.amountInETH,
              USD: operationPriceOtherRaw.amountInUSD,
            },
            withFee: {
              ETH: operationPriceIncludeFee.amountInETH,
              USD: operationPriceIncludeFee.amountInUSD,
            },
          },
          isTrustedProvider: false,
          timeStamp: currentData.timeStamp,
          transactionHash: currentData.hash,
          transactionFeeETH,
          transactionFeeUSD,
        };
      }

      return state;
    } catch (e) {
      throw e;
    }
  }

  private operationPriceWithFee(
    operationPrice: IOperationPrice,
    feeETH: BigNumber,
    feeUSD: BigNumber,
  ): IOperationPrice {
    return {
      ...operationPrice,
      amountInUSD: operationPrice.amountInUSD.plus(feeUSD),
      amountInETH: operationPrice.amountInETH.plus(feeETH),
    };
  }

  private balanceDifferences(currentBalance: ITokenBalanceInfo, beforeBalance: ITokenBalanceInfo): IOperationAmount[] {
    const tokensAddress = lodash.uniq([...Object.keys(currentBalance), ...Object.keys(beforeBalance)]);
    const diffs: IOperationAmount[] = [];
    for (const key of tokensAddress) {
      if (!(currentBalance[key].amount.toString() === beforeBalance[key]?.amount?.toString())) {
        diffs.push({
          symbol: currentBalance[key].symbol,
          name: currentBalance[key].name,
          address: currentBalance[key].address.toLowerCase(),
          decimals: currentBalance[key].decimals,
          amount: beforeBalance[key]?.amount
            ? currentBalance[key].amount.minus(beforeBalance[key].amount)
            : new BigNumber(currentBalance[key].amount.toString()),
        });
      }
    }
    return diffs.filter((x) => !stableCoinList.some((y) => y.address === x.address.toLowerCase()));
  }

  private operationPriceFromOtherSource(
    operations: IOperationAmount[],
    balanceData: ITokenBalanceInfo,
  ): IOperationPrice {
    // Outgoing operations
    const outgoing = operations.reduce(
      (accum, currentValue) => {
        if (!balanceData[currentValue.address]) {
          throw new Error('Wrong operationPriceFromOtherSource');
        }
        // Catch only outgoing operations
        if (currentValue.amount.isLessThan(0)) {
          accum.amountInETH = accum.amountInETH.plus(
            buildBalanceTransformer(currentValue.amount.negated(), +currentValue.decimals).multipliedBy(
              balanceData[currentValue.address].ethPer1Token,
            ),
          );
          accum.amountInUSD = accum.amountInUSD.plus(
            buildBalanceTransformer(currentValue.amount.negated(), +currentValue.decimals).multipliedBy(
              balanceData[currentValue.address].usdPer1Token,
            ),
          );

          accum.usdPer1ETH = balanceData[currentValue.address].usdPer1ETH;
        }
        return accum;
      },
      { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0), usdPer1ETH: new BigNumber(0) },
    );

    // Income operations
    const income = operations.reduce(
      (accum, currentValue) => {
        if (!balanceData[currentValue.address]) {
          throw new Error('Wrong operationPriceFromOtherSource');
        }
        // Catch only outgoing operations
        if (currentValue.amount.isGreaterThan(0)) {
          accum.amountInETH = accum.amountInETH.plus(
            buildBalanceTransformer(currentValue.amount, +currentValue.decimals).multipliedBy(
              balanceData[currentValue.address].ethPer1Token,
            ),
          );
          accum.amountInUSD = accum.amountInUSD.plus(
            buildBalanceTransformer(currentValue.amount, +currentValue.decimals).multipliedBy(
              balanceData[currentValue.address].usdPer1Token,
            ),
          );

          accum.usdPer1ETH = balanceData[currentValue.address].usdPer1ETH;
        }
        return accum;
      },
      { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0), usdPer1ETH: new BigNumber(0) },
    );

    return outgoing.amountInETH.isGreaterThan(0) ? outgoing : income;
  }

  private operationPriceFromUniswap(data: IUniswapRawTransaction): IOperationPrice {
    return {
      amountInETH: new BigNumber(data.amountETH),
      amountInUSD: new BigNumber(data.amountUSD),
      usdPer1ETH: new BigNumber(data.ethPrice),
    };
  }
}
