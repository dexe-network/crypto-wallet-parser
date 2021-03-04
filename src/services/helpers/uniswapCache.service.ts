import IORedis from 'ioredis';
import shortHash from 'shorthash2';
import { IParserApiConfig } from '../../interfaces';

export class UniswapCacheService {
  private redis: IORedis.Redis;

  constructor(config: IParserApiConfig) {
    this.redis = new IORedis(config.env.uniswapCacheRedisURL);
  }

  public async getData<T>(keyValue: string): Promise<T> {
    const key = shortHash(keyValue);
    try {
      if (await this.redis.exists(key)) {
        return this.getObjectFromRedis<T>(key);
      } else {
        throw new Error('Wrong Redis Cache Behaviour');
      }
    } catch (e) {
      throw e;
    }
  }

  public async setData<T>(keyValue: string, data: T): Promise<void> {
    const key = shortHash(keyValue);
    await this.setObjectToRedis<T>(key, data);
  }

  public async isExist(keyValue: string): Promise<boolean> {
    const key = shortHash(keyValue);
    return !!(await this.redis.exists(key));
  }

  private async getObjectFromRedis<T>(key: string): Promise<T> {
    try {
      return JSON.parse(<string>await this.redis.get(key));
    } catch (e) {
      throw e;
    }
  }

  private async setObjectToRedis<T>(key: string, data: T): Promise<IORedis.Ok | null> {
    try {
      return this.redis.set(key, JSON.stringify(data));
    } catch (e) {
      throw e;
    }
  }
}
