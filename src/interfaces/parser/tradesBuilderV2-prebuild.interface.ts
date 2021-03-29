import { IOperationItemBase, ITradeEvent, ITradeItem } from './tradesBuilderV2.interface';
import { ITokenBalanceInfo, ITokenBalanceItemBase } from '../etherscan.interfaces';

export interface IPrebuildOperationItemBase extends IOperationItemBase {
  balances: ITokenBalanceInfo<ITokenBalanceItemBase>;
  balancesBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>;
  blockNumber: number;
}

export interface IPrebuildTradeEvent extends ITradeEvent {
  balances: ITokenBalanceInfo<ITokenBalanceItemBase>;
  balancesBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>;
  blockNumber: number;
}

export interface IPrebuildTradeItem extends ITradeItem {
  tradeEvents: IPrebuildTradeEvent[];
}

export interface IPrebuildTradeIterateObject {
  // Token Address
  [key: string]: IPrebuildTradeIterateItem;
}

export interface IPrebuildTradeIterateItem {
  tokenAddress: string;
  trades: IPrebuildTradeItem[];
}
