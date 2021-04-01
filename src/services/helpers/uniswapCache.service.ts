import IORedis from 'ioredis';
import shortHash from 'shorthash2';
import {
  ICheckTokenArrPriceInUSDandETHArguments,
  IGetUniswapTransactionByIdArguments,
  IParserApiConfig,
} from '../../interfaces';

export class UniswapCacheService {
  private redis: IORedis.Redis;

  constructor(config: IParserApiConfig) {
    this.redis = new IORedis(config.env.uniswapCacheRedisURL);
  }

  public async getData<T>(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
  ): Promise<T> {
    const stringifyKeyData = JSON.stringify(keyData);
    const key = shortHash(stringifyKeyData);
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

  public async setData<T>(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
    data: T,
  ): Promise<void> {
    const stringifyKeyData = JSON.stringify(keyData);
    const key = shortHash(stringifyKeyData);
    await this.setObjectToRedis<T>(key, data);
  }

  public async isExist(
    keyData: ICheckTokenArrPriceInUSDandETHArguments | IGetUniswapTransactionByIdArguments,
  ): Promise<boolean> {
    const stringifyKeyData = JSON.stringify(keyData);
    const key = shortHash(stringifyKeyData);
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
