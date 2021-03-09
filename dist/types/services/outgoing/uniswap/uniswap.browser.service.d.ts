import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { IParserClientConfig } from '../../../interfaces';
import { UniswapServiceBase } from './uniswap.service';
export declare class UniswapServiceClient extends UniswapServiceBase {
    protected config: IParserClientConfig;
    protected limiter: Bottleneck;
    protected clientGQ: GraphQLClient;
    constructor(config: IParserClientConfig);
}
