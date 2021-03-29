export interface IPreBuildParseItem {
    hash: string;
    tokens: string[];
    blockNumber: number;
}
export interface ICacheRequestData {
    prebuildTrades: IPreBuildParseItem[];
    firstTransaction: IPreBuildParseItem;
    lastTransaction: IPreBuildParseItem;
    uniswapTransactions: IPreBuildParseItem[];
    requestsCount: number;
}
