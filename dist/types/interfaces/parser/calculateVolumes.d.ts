import BigNumber from 'bignumber.js';
import { IAppTokenInfo } from './tradesBuilderV2.interface';
export interface IVolumesObject {
    [ket: string]: IVolumesItem;
}
export interface IVolumesItem {
    contractAddress: string;
    volumeUSD: BigNumber;
    volumeETH: BigNumber;
    buyOperationsCount: BigNumber;
    sellOperationsCount: BigNumber;
    tokenInfo: IAppTokenInfo;
}
