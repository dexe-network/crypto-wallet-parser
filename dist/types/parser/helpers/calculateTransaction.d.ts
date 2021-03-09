import BigNumber from 'bignumber.js';
import { IGetCurrentWalletBalanceResult, ITotalIndicators } from '../../interfaces/parser/calculateTransaction.interface';
import { IGroupedTransactions, ITokenBalanceItem } from '../../interfaces/etherscan.interfaces';
import { ITradeItem } from '../../interfaces/parser/tradesBuilderV2.interface';
export declare class CalculateTransaction {
    points(profitLoss: BigNumber, tokenAddress: string): BigNumber;
    private pointsMultiply;
    calculateProfitLossOnAnyPosition(data: ITradeItem): ITotalIndicators;
    totalProfitLoss(data: ITradeItem[]): ITotalIndicators;
    totalPoints(data: ITradeItem[]): BigNumber;
    tradesCount(data: ITradeItem[]): number;
    getCurrentWalletBalance(data: IGroupedTransactions<ITokenBalanceItem>): IGetCurrentWalletBalanceResult;
}
