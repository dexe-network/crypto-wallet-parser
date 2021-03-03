import BigNumber from 'bignumber.js';
import {
  IGetCurrentWalletBalanceResult,
  ITotalIndicators,
} from '../../interfaces/parser/calculateTransaction.interface';
import { X2POINTS, X3POINTS } from '../../constants/pointWalletAddress';
import { IGroupedTransactions } from '../../interfaces/etherscan.interfaces';
import { ITradeItem, TradeType } from '../../interfaces/parser/tradesBuilderV2.interface';

export class CalculateTransaction {
  public points(profitLoss: BigNumber, tokenAddress: string): BigNumber {
    const percentMultiply = this.pointsMultiply(tokenAddress);
    return profitLoss.multipliedBy(percentMultiply);
  }

  private pointsMultiply(walletAddress: string): number {
    if (X3POINTS.includes(walletAddress)) {
      return 3;
    }

    if (X2POINTS.includes(walletAddress)) {
      return 2;
    }

    return 1;
  }

  public calculateProfitLossOnAnyPosition(data: ITradeItem): ITotalIndicators {
    const buyEvents = data.tradeEvents.filter((x) => x.tradeType === TradeType.BUY);
    const sellEvents = data.tradeEvents.filter((x) => x.tradeType === TradeType.SELL);

    if (sellEvents.length === 0) {
      return {
        profitLoss: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
        profit: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
      };
    }

    const profit = buyEvents.reduce(
      (accum, value) => {
        const plFromValue = value.sellOperations.reduce(
          (accumLocal, valueLocal) => {
            accumLocal.profitLoss.eth = accumLocal.profitLoss.eth.plus(valueLocal.profitLoss.eth);
            accumLocal.profitLoss.usd = accumLocal.profitLoss.usd.plus(valueLocal.profitLoss.usd);

            accumLocal.profit.eth = accumLocal.profit.eth.plus(valueLocal.profit.eth);
            accumLocal.profit.usd = accumLocal.profit.usd.plus(valueLocal.profit.usd);
            return accumLocal;
          },
          {
            profitLoss: { eth: new BigNumber(0), usd: new BigNumber(0) },
            profit: { eth: new BigNumber(0), usd: new BigNumber(0) },
          },
        );

        accum.profitLoss.eth = accum.profitLoss.eth.plus(plFromValue.profitLoss.eth);
        accum.profitLoss.usd = accum.profitLoss.usd.plus(plFromValue.profitLoss.usd);

        accum.profit.eth = accum.profit.eth.plus(plFromValue.profit.eth);
        accum.profit.usd = accum.profit.usd.plus(plFromValue.profit.usd);
        return accum;
      },
      {
        profitLoss: { eth: new BigNumber(0), usd: new BigNumber(0) },
        profit: { eth: new BigNumber(0), usd: new BigNumber(0) },
      },
    );

    return {
      profitLoss: { fromETH: profit.profitLoss.eth, fromUSD: profit.profitLoss.usd },
      profit: { fromETH: profit.profit.eth, fromUSD: profit.profit.usd },
    };
  }

  public totalProfitLoss(data: ITradeItem[]): ITotalIndicators {
    return data.reduce(
      (accum, value) => {
        accum.profitLoss.fromETH = accum.profitLoss.fromETH.plus(value.profitLossFromETH);
        accum.profitLoss.fromUSD = accum.profitLoss.fromUSD.plus(value.profitLossFromUSD);

        accum.profit.fromETH = accum.profit.fromETH.plus(value.profitFromETH);
        accum.profit.fromUSD = accum.profit.fromUSD.plus(value.profitFromUSD);
        return accum;
      },
      {
        profitLoss: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
        profit: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
      },
    );
  }

  public totalPoints(data: ITradeItem[]): BigNumber {
    return data.reduce((accum, value) => {
      accum = accum.plus(value.points);
      return accum;
    }, new BigNumber(0));
  }

  public tradesCount(data: ITradeItem[]): number {
    return data.reduce((accum, value) => {
      accum = accum + value.tradeEvents.length;
      return accum;
    }, 0);
  }

  public getCurrentWalletBalance(data: IGroupedTransactions): IGetCurrentWalletBalanceResult {
    return Object.values(data.balance).reduce(
      (accum, currentValue) => {
        accum['amountInETH'] = accum['amountInETH'].plus(currentValue.amountInETH);
        accum['amountInUSD'] = accum['amountInUSD'].plus(currentValue.amountInUSD);
        return accum;
      },
      { amountInETH: new BigNumber(0), amountInUSD: new BigNumber(0) },
    );
  }
}
