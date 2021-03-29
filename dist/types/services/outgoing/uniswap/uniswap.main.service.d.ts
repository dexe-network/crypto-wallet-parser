import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { UniswapCacheService } from '../../helpers/uniswapCache.service';
import IORedis from 'ioredis';
import { IParserApiConfig } from '../../../interfaces';
import { UniswapServiceBase } from './uniswap.service';
export declare class UniswapServiceApi extends UniswapServiceBase {
    protected config: IParserApiConfig;
    protected limiter: Bottleneck;
    protected clientGQ: GraphQLClient;
    protected uniswapCacheService: UniswapCacheService;
    protected redis: IORedis.Redis;
    constructor(config: IParserApiConfig);
}
