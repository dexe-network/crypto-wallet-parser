import BigNumber from 'bignumber.js';
export interface IGetCurrentWalletBalanceResult {
    amountInETH: BigNumber;
    amountInUSD: BigNumber;
}
export interface ITotalIndicators {
    profitLoss: {
        fromETH: BigNumber;
        fromUSD: BigNumber;
    };
    profit: {
        fromETH: BigNumber;
        fromUSD: BigNumber;
    };
}
