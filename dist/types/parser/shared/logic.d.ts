import { ITokenBalanceInfo, ITokenBalanceItemBase } from '../../interfaces';
export declare const generateTokenAdressPriceArr: (data: {
    balancesBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>;
    balances: ITokenBalanceInfo<ITokenBalanceItemBase>;
}) => string[];
