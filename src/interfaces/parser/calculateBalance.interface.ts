import BigNumber from 'bignumber.js';
import { ITokenBalanceInfo } from '../etherscan.interfaces';

export interface IBalanceLookupResult {
  feeInETH: BigNumber;
  balance: ITokenBalanceInfo;
  blockNumber: number;
  hash: string;
  timeStamp: string;
}
