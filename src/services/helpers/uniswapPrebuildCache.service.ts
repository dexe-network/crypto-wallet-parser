import shortHash from 'shorthash2';

export class UniswapPrebuildCacheService {
  private cache = new Map();

  public async getData<T>(keyValue: string): Promise<T> {
    const key = shortHash(keyValue);
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

  public async setData<T>(keyValue: string, data: T): Promise<void> {
    const key = shortHash(keyValue);
    this.setObjectToCache<T>(key, data);
  }

  public async isExist(keyValue: string): Promise<boolean> {
    const key = shortHash(keyValue);
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
