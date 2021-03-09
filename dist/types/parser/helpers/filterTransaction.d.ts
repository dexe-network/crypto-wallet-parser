import { IGroupedTransactions, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
export declare class FilterTransaction {
    filterAfterRegistration(data: IGroupedTransactions<ITokenBalanceItemBase>[], blockNumber: number): IGroupedTransactions<ITokenBalanceItemBase>[];
}
