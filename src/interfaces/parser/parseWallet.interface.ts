import BigNumber from 'bignumber.js';
import { Log } from '@ethersproject/abstract-provider/src.ts/index';
import { IGetCurrentWalletBalanceResult, ITotalIndicators } from './calculateTransaction.interface';
import { ITradeItem } from './tradesBuilderV2.interface';

export interface IDataProviderResult {
  points: BigNumber;
  totalIndicators: ITotalIndicators;
  transactionsCount: number;
  tradesCount: number;
  currentDeposit: IGetCurrentWalletBalanceResult;
  startDeposit: IGetCurrentWalletBalanceResult;
  lastCheckBlockNumber: number;
  trades: ITradeItem[];
}

export interface ITransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  root?: string;
  gasUsed: BigNumber;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<Log>;
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: BigNumber;
  byzantium: boolean;
  status?: number;
}
