import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { IParserClientConfig } from '../../../interfaces';
import defaultConfig from '../../../constants/defaultConfig';
import { UniswapServiceBase } from './uniswap.service';
import { UniswapPrebuildCacheService } from '../../helpers/uniswapPrebuildCache.service';

export class UniswapServiceClient extends UniswapServiceBase {
  protected limiter: Bottleneck;
  protected clientGQ: GraphQLClient;
  public uniswapCacheService: UniswapPrebuildCacheService;

  constructor(protected config: IParserClientConfig) {
    super();

    this.limiter = new Bottleneck({
      minTime: 100,
      maxConcurrent: 5,
    });

    this.clientGQ = new GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl);
    this.uniswapCacheService = new UniswapPrebuildCacheService();

    if (this.config.cache) {
      this.uniswapCacheService.cache = new Map(Object.entries(this.config.cache));
    }
  }
}
