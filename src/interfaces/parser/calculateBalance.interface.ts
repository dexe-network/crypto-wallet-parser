import BigNumber from 'bignumber.js';
import { ITokenBalanceInfo, ITokenBalanceItemBase } from '../etherscan.interfaces'

export interface IBalanceLookupResult {
  feeInETH: BigNumber;
  balance: ITokenBalanceInfo<ITokenBalanceItemBase>;
  blockNumber: number;
  hash: string;
  timeStamp: string;
}
