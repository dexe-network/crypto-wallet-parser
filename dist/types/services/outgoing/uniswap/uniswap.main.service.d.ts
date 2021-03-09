import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { UniswapCacheService } from '../../helpers/uniswapCache.service';
import IORedis from 'ioredis';
import { IArrTokenPriceCheckResult, ICheckTokenArrPriceInUSDandETHArguments, IParserApiConfig } from '../../../interfaces';
import { UniswapServiceBase } from './uniswap.service';
export declare class UniswapServiceApi extends UniswapServiceBase {
    protected config: IParserApiConfig;
    protected limiter: Bottleneck;
    protected clientGQ: GraphQLClient;
    protected uniswapCacheService: UniswapCacheService;
    protected redis: IORedis.Redis;
    constructor(config: IParserApiConfig);
    checkTokenArrPriceInUSDandETHLimiter(argumentsData: ICheckTokenArrPriceInUSDandETHArguments): Promise<IArrTokenPriceCheckResult>;
    protected checkTokenArrPriceInUSDandETH(argumentsData: ICheckTokenArrPriceInUSDandETHArguments): Promise<IArrTokenPriceCheckResult>;
}
