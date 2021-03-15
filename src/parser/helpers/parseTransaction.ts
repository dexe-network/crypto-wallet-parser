import { IGroupedTransactions, ITokenBalanceItem, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
import { buildBalanceTransformer } from '../../helpers/tokens.helper';
import BigNumber from 'bignumber.js';
import { UniswapServiceApi } from '../../services/outgoing/uniswap/uniswap.main.service';
import { UniswapServiceClient } from '../../services/outgoing/uniswap/uniswap.browser.service';

export class ParseTransaction {
  constructor(private uniswapService: UniswapServiceApi | UniswapServiceClient) {}

  public async parseTransactionBalancePrice(
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
}
