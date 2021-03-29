import { ITradeItem, ITradeIterateObject } from '../../interfaces/parser/tradesBuilderV2.interface';
import {
  IPrebuildTradeEvent,
  IPrebuildTradeItem,
  IPrebuildTradeIterateObject,
} from '../../interfaces/parser/tradesBuilderV2-prebuild.interface';
import lodash from 'lodash';
import { ICacheRequestData, IPreBuildParseItem } from '../../interfaces/parser/transformTransaction.interface';
import { IGroupedTransactions, ITokenBalanceItemBase } from '../../interfaces';
import config from '../../constants/defaultConfig';

export class TransformTransaction {
  public transformTokenTradeObjectToArr(data: ITradeIterateObject): ITradeItem[] {
    // Up all trades to single array
    return Object.values(data)
      .reduce((accum, item) => {
        accum.push(...item.trades);
        return accum;
      }, new Array<ITradeItem>())
      .sort((a, b) => {
        if (a.openTimeStamp < b.openTimeStamp) {
          return -1;
        }
        if (a.openTimeStamp > b.openTimeStamp) {
          return 1;
        }
        return 0;
      });
  }

  public buildCacheRequestData(
    prebuildTradesData: IPrebuildTradeIterateObject,
    rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[],
  ): ICacheRequestData {
    const prebuildTrades = this.transformPrebuildTokenTradeObjectToArr(prebuildTradesData);

    const firstTransactionRaw = rawTransactions[0];
    const firstTransaction: IPreBuildParseItem = {
      tokens: Object.keys(firstTransactionRaw.balance).filter((token) =>
        firstTransactionRaw.balance[token].amount.isGreaterThanOrEqualTo(0),
      ),
      blockNumber: firstTransactionRaw.blockNumber,
      hash: firstTransactionRaw.hash,
    };

    const lastTransactionRaw = rawTransactions[rawTransactions.length - 1];
    const lastTransaction: IPreBuildParseItem = {
      tokens: Object.keys(lastTransactionRaw.balance).filter((token) =>
        lastTransactionRaw.balance[token].amount.isGreaterThanOrEqualTo(0),
      ),
      blockNumber: lastTransactionRaw.blockNumber,
      hash: lastTransactionRaw.hash,
    };

    const uniswapTransactions: IPreBuildParseItem[] = rawTransactions
      .filter(
        (x) =>
          x.normalTransactions && x.normalTransactions[0]?.to?.toLowerCase() === config.uniswap.uniswapRouterAddress,
      )
      .map((x) => {
        return {
          hash: x.hash,
          blockNumber: x.blockNumber,
          tokens: [],
        };
      });

    return {
      prebuildTrades,
      firstTransaction,
      lastTransaction,
      uniswapTransactions,
      requestsCount: +(
        firstTransaction.tokens.length / 4.5 +
        lastTransaction.tokens.length / 4.5 +
        this.calculateTokensLength(prebuildTrades) / 4.5 +
        uniswapTransactions.length
      ).toFixed(),
    };
  }

  private calculateTokensLength(data: IPreBuildParseItem[]): number {
    return data.reduce((accum, value) => {
      accum += value.tokens.length;
      return accum;
    }, 0);
  }

  public transformPrebuildTokenTradeObjectToArr(data: IPrebuildTradeIterateObject): IPreBuildParseItem[] {
    // Up all trades to single array
    return Object.values(data)
      .reduce((accum, item) => {
        accum.push(...item.trades);
        return accum;
      }, new Array<IPrebuildTradeItem>())
      .reduce((accum, item) => {
        accum.push(...item.tradeEvents);
        return accum;
      }, new Array<IPrebuildTradeEvent>())
      .map((item) => {
        return {
          hash: item.transactionHash,
          tokens: lodash.uniq([
            ...Object.keys(item.balancesBeforeTransaction).filter((token) =>
              item.balancesBeforeTransaction[token].amount.isGreaterThan(0),
            ),
            ...Object.keys(item.balances).filter((token) => item.balances[token].amount.isGreaterThanOrEqualTo(0)),
          ]),
          blockNumber: item.blockNumber,
        };
      });
  }
}
