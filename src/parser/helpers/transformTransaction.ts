import { ITradeItem, ITradeIterateObject } from '../../interfaces/parser/tradesBuilderV2.interface';

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
}
