import UniswapService from '../../services/outgoing/uniswap/uniswap.service';
import { Logger } from 'winston';
import LoggerInstance from '../../helpers/logger';
import { IGroupedTransactions } from '../../interfaces/etherscan.interfaces';
import { buildBalanceTransformer } from '../../helpers/tokens.helper';
import BigNumber from 'bignumber.js';

export class ParseTransaction {
  private uniswapService: UniswapService;
  private logger: Logger = LoggerInstance;

  constructor() {
    this.uniswapService = Container.get(UniswapService);
  }

  public async parseTransactionBalancePrice(transactions: IGroupedTransactions[]): Promise<IGroupedTransactions[]> {
    try {
      const resultWithParsedBalance = await Promise.all(
        transactions.map(async (value, index, array) => {
          const valueCopy = { ...value };
          const prices = await this.uniswapService.checkTokenArrPriceInUSDandETHLimiter({
            tokens: Object.keys(value.balance),
            blockNumber: valueCopy.blockNumber,
          });

          for (const key of Object.keys(value.balance)) {
            const uniswapResultFirst = prices[valueCopy.balance[key].address];
            valueCopy.balance[key].ethPer1Token = uniswapResultFirst.ethPer1Token;
            valueCopy.balance[key].usdPer1Token = uniswapResultFirst.usdPer1Token;
            valueCopy.balance[key].usdPer1ETH = uniswapResultFirst.usdPer1ETH;

            valueCopy.balance[key].amountInETH = buildBalanceTransformer(
              // Catch less zero token balance (Fix minus Dep)
              valueCopy.balance[key].amount.isLessThan(0) ? new BigNumber(0) : valueCopy.balance[key].amount,
              +valueCopy.balance[key].decimals,
            ).multipliedBy(uniswapResultFirst.ethPer1Token);

            valueCopy.balance[key].amountInUSD = buildBalanceTransformer(
              valueCopy.balance[key].amount.isLessThan(0) ? new BigNumber(0) : valueCopy.balance[key].amount,
              +valueCopy.balance[key].decimals,
            ).multipliedBy(uniswapResultFirst.usdPer1Token);
          }

          if (index === 0) {
            for (const key of Object.keys(value.balanceBeforeTransaction)) {
              const uniswapResultSecond = prices[valueCopy.balanceBeforeTransaction[key].address];
              valueCopy.balanceBeforeTransaction[key].ethPer1Token = uniswapResultSecond.ethPer1Token;
              valueCopy.balanceBeforeTransaction[key].usdPer1Token = uniswapResultSecond.usdPer1Token;
              valueCopy.balanceBeforeTransaction[key].usdPer1ETH = uniswapResultSecond.usdPer1Token;

              valueCopy.balanceBeforeTransaction[key].amountInETH = buildBalanceTransformer(
                valueCopy.balanceBeforeTransaction[key].amount.isLessThan(0)
                  ? new BigNumber(0)
                  : valueCopy.balanceBeforeTransaction[key].amount,
                +valueCopy.balanceBeforeTransaction[key].decimals,
              ).multipliedBy(uniswapResultSecond.ethPer1Token);

              valueCopy.balanceBeforeTransaction[key].amountInUSD = buildBalanceTransformer(
                valueCopy.balanceBeforeTransaction[key].amount.isLessThan(0)
                  ? new BigNumber(0)
                  : valueCopy.balanceBeforeTransaction[key].amount,
                +valueCopy.balanceBeforeTransaction[key].decimals,
              ).multipliedBy(uniswapResultSecond.usdPer1Token);
            }
          }

          return valueCopy;
        }),
      );

      return resultWithParsedBalance.map((value, index, array) => {
        const valueCopy = { ...value };
        if (index === 0) {
        } else {
          valueCopy.balanceBeforeTransaction = array[index - 1].balance;
        }
        return valueCopy;
      });
    } catch (e) {
      throw e;
    }
  }
}
