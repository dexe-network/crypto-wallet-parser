import { IGroupedTransactions, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';

export class FilterTransaction {
  public filterAfterRegistration(
    data: IGroupedTransactions<ITokenBalanceItemBase>[],
    blockNumber: number,
  ): IGroupedTransactions<ITokenBalanceItemBase>[] {
    return data.filter((item) => item.blockNumber > blockNumber);
  }
}
