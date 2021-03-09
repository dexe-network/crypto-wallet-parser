import { IGroupedTransactions, IGroupedTransactionsBase, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
export declare class CalculateBalance {
    buildBalance(data: IGroupedTransactionsBase[], wallet: string): IGroupedTransactions<ITokenBalanceItemBase>[];
    private tokenContractAddressMigrateHandler;
    private filterTokenWIthZeroBalance;
    private balanceLookup;
    private erc20Balance;
    private balanceInternal;
    private balanceAndFeeFromNormal;
}
