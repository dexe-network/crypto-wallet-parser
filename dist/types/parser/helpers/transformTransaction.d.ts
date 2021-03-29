import { ITradeItem, ITradeIterateObject } from '../../interfaces/parser/tradesBuilderV2.interface';
import { IPrebuildTradeIterateObject } from '../../interfaces/parser/tradesBuilderV2-prebuild.interface';
import { ICacheRequestData, IPreBuildParseItem } from '../../interfaces/parser/transformTransaction.interface';
import { IGroupedTransactions, ITokenBalanceItemBase } from '../../interfaces';
export declare class TransformTransaction {
    transformTokenTradeObjectToArr(data: ITradeIterateObject): ITradeItem[];
    buildCacheRequestData(prebuildTradesData: IPrebuildTradeIterateObject, rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[]): ICacheRequestData;
    private calculateTokensLength;
    transformPrebuildTokenTradeObjectToArr(data: IPrebuildTradeIterateObject): IPreBuildParseItem[];
}
