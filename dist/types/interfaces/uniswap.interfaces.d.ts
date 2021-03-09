import BigNumber from 'bignumber.js';
export interface IUniToken {
    decimals: string;
    derivedETH: string;
    id: string;
    name: string;
    symbol: string;
    totalLiquidity: string;
    totalSupply: string;
    tradeVolume: string;
    tradeVolumeUSD: string;
    txCount: string;
    untrackedVolumeUSD: string;
}
export interface IUniPair {
    id: string;
    tokenIn: IUniToken;
    tokenOut: IUniToken;
    untrackedVolumeUSD: string;
    volumeUSD: string;
}
export interface IUniPairRaw {
    id: string;
    token0: IUniToken;
    token1: IUniToken;
    untrackedVolumeUSD: string;
    volumeUSD: string;
}
export interface IUniTransactionItem {
    blockNumber: string;
    id: string;
    timestamp: string;
}
export interface IUniswapRawTransaction {
    amount0In: string;
    amount0Out: string;
    amount1In: string;
    amount1Out: string;
    amountUSD: string;
    amountETH: string;
    ethPrice: string;
    id: string;
    logIndex: string;
    pair: IUniPairRaw;
    sender: string;
    timestamp: string;
    to: string;
    transaction: IUniTransactionItem;
}
export interface IUniswapTransaction {
    amountIn: BigNumber;
    amountOut: BigNumber;
    amountUSD: BigNumber;
    amountETH: BigNumber;
    id: string;
    logIndex: string;
    pair: IUniPair;
    sender: string;
    timestamp: string;
    to: string;
    transaction: IUniTransactionItem;
}
export interface IArrTokenPriceCheckResult {
    [key: string]: ITokenPriceUSDETH;
}
export interface ITokenPriceUSDETH {
    usdPer1Token: BigNumber;
    ethPer1Token: BigNumber;
    usdPer1ETH: BigNumber;
}
export interface ICheckTokenArrPriceInUSDandETHResponse {
    usdc0: IToken0[];
    usdc1: IToken1[];
    weth0: IToken0[];
    weth1: IToken1[];
    ethPrice: {
        ethPrice: string;
    }[];
}
export interface IToken0 {
    id: string;
    token1Price: string;
    token0: {
        id: string;
        symbol: string;
    };
}
export interface IToken1 {
    id: string;
    token0Price: string;
    token1: {
        id: string;
        symbol: string;
    };
}
export interface ICheckTokenArrPriceInUSDandETHArguments {
    tokens: string[];
    blockNumber: number;
}
