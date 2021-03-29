import lodash from 'lodash';
import { ITokenBalanceInfo, ITokenBalanceItemBase } from '../../interfaces';

export const generateTokenAdressPriceArr = (data: {
  balancesBeforeTransaction: ITokenBalanceInfo<ITokenBalanceItemBase>;
  balances: ITokenBalanceInfo<ITokenBalanceItemBase>;
}) => {
  return lodash.uniq([
    ...Object.keys(data.balancesBeforeTransaction).filter((token) =>
      data.balancesBeforeTransaction[token].amount.isGreaterThan(0),
    ),
    ...Object.keys(data.balances).filter((token) => data.balances[token].amount.isGreaterThanOrEqualTo(0)),
  ]);
};
