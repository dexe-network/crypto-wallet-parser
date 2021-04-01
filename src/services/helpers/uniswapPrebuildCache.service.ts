import shortHash from 'shorthash2';
import { ICheckTokenArrPriceInUSDandETHArguments, IGetUniswapTransactionByIdArguments } from '../../interfaces';

export class UniswapPrebuildCacheService {
  public cache = new Map();

  public async getData<T>(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
  ): Promise<T> {
    const stringifyKeyData = JSON.stringify(keyData);
    const key = shortHash(stringifyKeyData);
    try {
      if (this.cache.has(key)) {
        return this.getObjectFromCache<T>(key);
      } else {
        throw new Error('Wrong Cache Service Behaviour');
      }
    } catch (e) {
      throw e;
    }
  }

  public async setData<T>(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
    data: T,
  ): Promise<void> {
    const stringifyKeyData = JSON.stringify(keyData);
    const key = shortHash(stringifyKeyData);
    this.setObjectToCache<T>(key, data);
  }

  public async isExist(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
  ): Promise<boolean> {
    const stringifyKeyData = JSON.stringify(keyData);
    const key = shortHash(stringifyKeyData);
    return this.cache.has(key);
  }

  private getObjectFromCache<T>(key: string): T {
    try {
      return this.cache.get(key);
    } catch (e) {
      throw e;
    }
  }

  private setObjectToCache<T>(key: string, data: T): void {
    try {
      this.cache.set(key, data);
    } catch (e) {
      throw e;
    }
  }
}
