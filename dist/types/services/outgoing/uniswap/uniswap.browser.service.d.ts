import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { IParserClientConfig } from '../../../interfaces';
import { UniswapServiceBase } from './uniswap.service';
import { UniswapPrebuildCacheService } from '../../helpers/uniswapPrebuildCache.service';
export declare class UniswapServiceClient extends UniswapServiceBase {
    protected config: IParserClientConfig;
    protected limiter: Bottleneck;
    protected clientGQ: GraphQLClient;
    uniswapCacheService: UniswapPrebuildCacheService;
    constructor(config: IParserClientConfig);
}
