import BigNumber from 'bignumber.js';
import { IAppTokenInfo } from '../interfaces/parser/tradesBuilderV2.interface';
export declare const tokenBalanceTransformer: (value: string | number, arg: IAppTokenInfo) => BigNumber;
export declare const buildBalanceTransformer: (value: BigNumber, decimals: number) => BigNumber;
