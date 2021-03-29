import BigNumber from 'bignumber.js';

export interface IOperationItem extends IOperationItemBase {
  amount: {
    raw: {
      ETH: BigNumber;
      USD: BigNumber;
    };
    withFee: {
      ETH: BigNumber;
      USD: BigNumber;
    };
  };
  transactionFeeETH: BigNumber;
  transactionFeeUSD: BigNumber;
}

export interface IOperationItemBase {
  operations: IOperationAmount[];
  operationInfo: IOperationTokens;
  timeStamp: string;
  transactionHash: string;
  isVirtualTransaction: boolean;
  isTrustedProvider: boolean;
}

export interface IOperationTokens {
  sent: IOperationAmount[];
  received: IOperationAmount[];
}

export interface balanceDifferencesResult {
  differences: IOperationAmount[];
  operationInfo: IOperationTokens;
}

export interface IOperationAmount {
  symbol: string;
  name: string;
  address: string;
  decimals: string;
  amount: BigNumber;
}

export interface IOperationPrice {
  amountInETH: BigNumber;
  amountInUSD: BigNumber;
  usdPer1ETH: BigNumber;
}

////
export interface ITradeIterateObject {
  // Token Address
  [key: string]: ITradeIterateItem;
}

export interface ITradeIterateItem {
  tokenAddress: string;
  trades: ITradeItem[];
}

export interface ITradeItem {
  balance: BigNumber;
  startDep: IStartDep;
  tokenAddress: string;
  spendingUSD: BigNumber;
  incomeUSD: BigNumber;
  spendingETH: BigNumber;
  incomeETH: BigNumber;
  profitLossFromETH: BigNumber;
  profitLossFromUSD: BigNumber;
  profitFromETH: BigNumber;
  profitFromUSD: BigNumber;
  points: BigNumber;
  tradeStatus: TradeStatus;
  tradeEvents: ITradeEvent[];
  openTimeStamp: string;
  closeTimeStamp?: string;
}

export interface IStartDep {
  amountInETH: BigNumber;
  amountInUSD: BigNumber;
}

export interface ITradeEvent {
  tradeType: TradeType;
  amount: BigNumber;
  tokenInfo: IAppTokenInfo;
  transactionHash: string;
  timeStamp: string;
  transactionFeeUSD: BigNumber;
  transactionFeeETH: BigNumber;
  costUSD: BigNumber;
  costETH: BigNumber;
  price: IEventTokenPrice;
  startDep: IStartDep;
  balance: BigNumber;
  isVirtualTransaction: boolean;
  sellOperations: ISellOperations[];
  averageStartDep: IAverageStartDep;
  operationInfo: IOperationTokens;
}

export interface ISellOperations {
  sellTransactionHash: string;
  amount: BigNumber;
  profit: {
    usd: BigNumber;
    eth: BigNumber;
  };
  profitLoss: {
    usd: BigNumber;
    eth: BigNumber;
  };
  tokenInfo: IAppTokenInfo;
}

export interface IAverageStartDep {
  usd: BigNumber;
  eth: BigNumber;
}

export interface IEventTokenPrice {
  raw: {
    eth: BigNumber;
    usd: BigNumber;
  };
  withFee: {
    eth: BigNumber;
    usd: BigNumber;
  };
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SEll',
}

export enum TradeStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export interface IAppTokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: string;
}
