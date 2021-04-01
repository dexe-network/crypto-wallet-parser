import shortHash from 'object-hash';
import { ICheckTokenArrPriceInUSDandETHArguments, IGetUniswapTransactionByIdArguments } from '../../interfaces';

export class UniswapPrebuildCacheService {
  public cache = new Map();

  public async getData<T>(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
  ): Promise<T> {
    const key = shortHash(keyData);
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
    const key = shortHash(keyData);
    this.setObjectToCache<T>(key, data);
  }

  public async isExist(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
  ): Promise<boolean> {
    const key = shortHash(keyData);
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
