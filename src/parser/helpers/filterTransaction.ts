import { IGroupedTransactions } from '../../interfaces/etherscan.interfaces';

export class FilterTransaction {
  public filterAfterRegistration(data: IGroupedTransactions[], blockNumber: number): IGroupedTransactions[] {
    return data.filter((item) => item.blockNumber > blockNumber);
  }
}
