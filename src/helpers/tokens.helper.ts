import BigNumber from 'bignumber.js';
import { IAppTokenInfo } from '../interfaces/parser/tradesBuilderV2.interface';

export const tokenBalanceTransformer = (value: string | number, arg: IAppTokenInfo): BigNumber => {
  if (!value || !(typeof arg?.decimals === 'number')) {
    return new BigNumber(0);
  }

  const balance = new BigNumber(value);
  const decimals = arg.decimals;
  const decimalsBN = new BigNumber(decimals);
  const divisor = new BigNumber(10).pow(decimalsBN);
  const beforeDecimal = balance.div(divisor);
  return beforeDecimal;
};

export const buildBalanceTransformer = (value: BigNumber, decimals: number): BigNumber => {
  if (!value || !(typeof decimals === 'number')) {
    return new BigNumber(0);
  }

  const balance = value;
  const decimalsBN = new BigNumber(decimals);
  const divisor = new BigNumber(10).pow(decimalsBN);
  const beforeDecimal = balance.div(divisor);
  return beforeDecimal;
};
