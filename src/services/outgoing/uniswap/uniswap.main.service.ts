import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { UniswapCacheService } from '../../helpers/uniswapCache.service';
import IORedis from 'ioredis';
import {
  IArrTokenPriceCheckResult,
  ICheckTokenArrPriceInUSDandETHArguments,
  IParserApiConfig,
} from '../../../interfaces';
import defaultConfig from '../../../constants/defaultConfig';
import { UniswapServiceBase } from './uniswap.service';

export class UniswapServiceApi extends UniswapServiceBase {
  protected limiter: Bottleneck;
  protected clientGQ: GraphQLClient;
  protected uniswapCacheService: UniswapCacheService;
  protected redis: IORedis.Redis;

  constructor(protected config: IParserApiConfig) {
    super();

    this.redis = new IORedis(this.config.env.bottleneckRedisURL);
    const connection = new Bottleneck.IORedisConnection({ client: this.redis });
    this.limiter = new Bottleneck({
      minTime: 25,
      id: 'uniswap',
      clearDatastore: false,
      datastore: 'ioredis',
      connection,
      Redis: IORedis,
    });

    this.clientGQ = new GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl);
    this.uniswapCacheService = new UniswapCacheService(this.config);
  }

  public async checkTokenArrPriceInUSDandETHLimiter(
    argumentsData: ICheckTokenArrPriceInUSDandETHArguments,
  ): Promise<IArrTokenPriceCheckResult> {
    if (await this.uniswapCacheService.isExist(JSON.stringify(argumentsData))) {
      return this.uniswapCacheService.getData<IArrTokenPriceCheckResult>(JSON.stringify(argumentsData));
    }

    return super.checkTokenArrPriceInUSDandETHLimiter(argumentsData);
  }

  protected async checkTokenArrPriceInUSDandETH(
    argumentsData: ICheckTokenArrPriceInUSDandETHArguments,
  ): Promise<IArrTokenPriceCheckResult> {
    const dataResult = await super.checkTokenArrPriceInUSDandETH(argumentsData);
    // Write data to cache
    if (dataResult && !(await this.uniswapCacheService.isExist(JSON.stringify(argumentsData)))) {
      await this.uniswapCacheService.setData<IArrTokenPriceCheckResult>(JSON.stringify(argumentsData), dataResult);
    }
    return dataResult;
  }
}
