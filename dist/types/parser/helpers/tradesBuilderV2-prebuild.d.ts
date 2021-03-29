import { IGroupedTransactions, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
import { IParserClientConfig, IServices } from '../../interfaces';
import { IPrebuildTradeIterateObject } from '../../interfaces/parser/tradesBuilderV2-prebuild.interface';
export declare class TradesBuilderV2Prebuild {
    private services;
    private config;
    private behaviourConfig;
    constructor(services: IServices, config: IParserClientConfig);
    buildTrades(data: IGroupedTransactions<ITokenBalanceItemBase>[]): Promise<IPrebuildTradeIterateObject>;
    private generateVirtualTrades;
    private generateVirtualTransactions;
    private generateBalanceDiffForVirtualTradePnl;
    private behaviourIterator;
    private calculateOutgoingEvent;
    private calculateIncomeEvent;
    private calculateOperationWithOpenTrade;
    private createIterateSellEvents;
    private openNewTrade;
    private createNewTradeEvent;
    private createTokenInfo;
    private tradeTypeSwitcher;
    private isErrorTransaction;
    private getTokenOperationState;
    private balanceDifferences;
}
