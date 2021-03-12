import BigNumber from 'bignumber.js';
export interface IEtherscanResponse<T> {
    status: string;
    message: string;
    result: T;
}
export interface INormalTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}
export interface IInternalTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    from: string;
    to: string;
    value: string;
    contractAddress: string;
    input: string;
    type: string;
    gas: string;
    gasUsed: string;
    traceId: string;
    isError: string;
    errCode: string;
}
export interface IERC20Transaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    isError?: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}
export interface IERC721Transaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenID: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    isError?: string;
    confirmations: string;
}
export interface IEtherscanParams {
    address?: string;
    apikey?: string;
    startblock?: number;
    endblock?: number;
    sort?: 'asc' | 'desc';
    page?: number;
    offset?: number;
}
export interface IGroupedTransactionsBase {
    normalTransactions: INormalTransaction[];
    internalTransactions: IInternalTransaction[];
    erc20Transactions: IERC20Transaction[];
    erc721Transactions: IERC721Transaction[];
}
export interface IGroupedTransactions<ItemType> extends IGroupedTransactionsBase {
    balance: ITokenBalanceInfo<ItemType>;
    balanceBeforeTransaction: ITokenBalanceInfo<ItemType>;
    blockNumber: number;
    previousTransactionBlockNumber: number;
    feeInETH: BigNumber;
    hash: string;
    isVirtualTransaction: boolean;
    timeStamp: string;
}
export interface ITransactionsHashTable<T> {
    [key: string]: T;
}
export interface ITokenBalanceInfo<ItemType> {
    [key: string]: ItemType;
}
export interface ITokenBalanceItemBase {
    symbol: string;
    name: string;
    address: string;
    decimals: string;
    amount: BigNumber;
}
export interface ITokenBalanceItem extends ITokenBalanceItemBase {
    amountInETH: BigNumber;
    amountInUSD: BigNumber;
    usdPer1Token: BigNumber;
    ethPer1Token: BigNumber;
    usdPer1ETH: BigNumber;
}
