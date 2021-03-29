import { IGroupedTransactions, ITokenBalanceItem, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
import { buildBalanceTransformer } from '../../helpers/tokens.helper';
import BigNumber from 'bignumber.js';
import { UniswapServiceApi } from '../../services/outgoing/uniswap/uniswap.main.service';
import { UniswapServiceClient } from '../../services/outgoing/uniswap/uniswap.browser.service';
import { ICacheRequestData } from '../../interfaces/parser/transformTransaction.interface';
import { generateTokenAdressPriceArr } from '../shared/logic';

export class ParseTransaction {
  constructor(private uniswapService: UniswapServiceApi | UniswapServiceClient) {}

  private async parseTransactionBalancePrice(
    transactions: IGroupedTransactions<ITokenBalanceItemBase>[],
    isVirtualTransactions = false,
  ): Promise<IGroupedTransactions<ITokenBalanceItem>[]> {
    try {
      const resultWithParsedBalance = await Promise.all(
        transactions.map(async (itemValue, index, array) => {
          const value = itemValue as IGroupedTransactions<ITokenBalanceItem>;
          const prices = await this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
            tokens: Object.keys(value.balance),
            blockNumber: value.blockNumber,
          });

          for (const key of Object.keys(value.balance)) {
            const uniswapResultFirst = prices[value.balance[key].address];
            value.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
            value.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
            value.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;

            value.balance[key].amountInETH = buildBalanceTransformer(
              // Catch less zero token balance (Fix minus Dep)
              value.balance[key].amount.isLessThan(0) ? new BigNumber(0) : value.balance[key].amount,
              +value.balance[key].decimals,
            ).multipliedBy(uniswapResultFirst.ethPer1Token);

            value.balance[key].amountInUSD = buildBalanceTransformer(
              value.balance[key].amount.isLessThan(0) ? new BigNumber(0) : value.balance[key].amount,
              +value.balance[key].decimals,
            ).multipliedBy(uniswapResultFirst.usdPer1Token);
          }

          if (index === 0 && !isVirtualTransactions) {
            for (const key of Object.keys(value.balanceBeforeTransaction)) {
              const uniswapResultSecond = prices[value.balanceBeforeTransaction[key].address];
              value.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
              value.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
              value.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;

              value.balanceBeforeTransaction[key].amountInETH = buildBalanceTransformer(
                value.balanceBeforeTransaction[key].amount.isLessThan(0)
                  ? new BigNumber(0)
                  : value.balanceBeforeTransaction[key].amount,
                +value.balanceBeforeTransaction[key].decimals,
              ).multipliedBy(uniswapResultSecond.ethPer1Token);

              value.balanceBeforeTransaction[key].amountInUSD = buildBalanceTransformer(
                value.balanceBeforeTransaction[key].amount.isLessThan(0)
                  ? new BigNumber(0)
                  : value.balanceBeforeTransaction[key].amount,
                +value.balanceBeforeTransaction[key].decimals,
              ).multipliedBy(uniswapResultSecond.usdPer1Token);
            }
          }

          return value;
        }),
      );

      return resultWithParsedBalance;
    } catch (e) {
      throw e;
    }
  }

  public async parseTransactionBalancePriceSingle(
    transaction: IGroupedTransactions<ITokenBalanceItemBase>,
    parseBeforePrices = false,
  ): Promise<IGroupedTransactions<ITokenBalanceItem>> {
    try {
      const value = transaction as IGroupedTransactions<ITokenBalanceItem>;
      const prices = await this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
        tokens: parseBeforePrices
          ? // Important value - affect to generate cache id
            generateTokenAdressPriceArr({
              balances: value.balance,
              balancesBeforeTransaction: value.balanceBeforeTransaction,
            })
          : Object.keys(value.balance).filter((token) => value.balance[token].amount.isGreaterThanOrEqualTo(0)),
        blockNumber: value.blockNumber,
      });

      for (const key of Object.keys(value.balance)) {
        const uniswapResultFirst = prices[value.balance[key].address];
        if (value.balance[key].amount.isGreaterThanOrEqualTo(0)) {
          value.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
          value.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
          value.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;

          value.balance[key].amountInETH = buildBalanceTransformer(
            value.balance[key].amount,
            +value.balance[key].decimals,
          ).multipliedBy(uniswapResultFirst.ethPer1Token);

          value.balance[key].amountInUSD = buildBalanceTransformer(
            value.balance[key].amount,
            +value.balance[key].decimals,
          ).multipliedBy(uniswapResultFirst.usdPer1Token);
        } else {
          value.balance[key].ethPer1Token = new BigNumber(0);
          value.balance[key].usdPer1Token = new BigNumber(0);
          value.balance[key].usdPer1ETH = new BigNumber(0);
          value.balance[key].amountInETH = new BigNumber(0);
          value.balance[key].amountInUSD = new BigNumber(0);
        }
      }

      if (parseBeforePrices) {
        for (const key of Object.keys(value.balanceBeforeTransaction)) {
          if (value.balanceBeforeTransaction[key].amount.isGreaterThan(0)) {
            const uniswapResultSecond = prices[value.balanceBeforeTransaction[key].address];
            value.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
            value.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
            value.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;

            value.balanceBeforeTransaction[key].amountInETH = buildBalanceTransformer(
              value.balanceBeforeTransaction[key].amount,
              +value.balanceBeforeTransaction[key].decimals,
            ).multipliedBy(uniswapResultSecond.ethPer1Token);

            value.balanceBeforeTransaction[key].amountInUSD = buildBalanceTransformer(
              value.balanceBeforeTransaction[key].amount,
              +value.balanceBeforeTransaction[key].decimals,
            ).multipliedBy(uniswapResultSecond.usdPer1Token);
          } else {
            value.balanceBeforeTransaction[key].ethPer1Token = new BigNumber(0);
            value.balanceBeforeTransaction[key].usdPer1Token = new BigNumber(0);
            value.balanceBeforeTransaction[key].usdPer1ETH = new BigNumber(0);
            value.balanceBeforeTransaction[key].amountInETH = new BigNumber(0);
            value.balanceBeforeTransaction[key].amountInUSD = new BigNumber(0);
          }
        }
      }

      return value;
    } catch (e) {
      throw e;
    }
  }

  public async parsePriceAndStoreToCache(data: ICacheRequestData): Promise<void> {
    try {
      const firstTransaction = this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
        tokens: data.firstTransaction.tokens,
        blockNumber: data.firstTransaction.blockNumber,
      });

      const lastTransaction = this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
        tokens: data.lastTransaction.tokens,
        blockNumber: data.lastTransaction.blockNumber,
      });

      // Parse Price
      await Promise.all<any>([
        ...data.prebuildTrades.map(async (itemValue) => {
          await this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
            tokens: itemValue.tokens,
            blockNumber: itemValue.blockNumber,
          });
          return true;
        }),

        // Parse Uniswap Transaction
        ...data.uniswapTransactions.map(async (itemValue) => {
          await this.uniswapService.getUniswapTransactionByIdLimiter({
            transactionId: itemValue.hash,
            blockNumber: itemValue.blockNumber,
          });
          return true;
        }),
        // Parse Start and Current Dep
        firstTransaction,
        lastTransaction,
      ]);
    } catch (e) {
      throw e;
    }
  }
}
