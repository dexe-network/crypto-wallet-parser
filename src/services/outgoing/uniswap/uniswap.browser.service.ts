import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { IParserClientConfig } from '../../../interfaces';
import defaultConfig from '../../../constants/defaultConfig';
import { UniswapServiceBase } from './uniswap.service';

export class UniswapServiceClient extends UniswapServiceBase {
  protected limiter: Bottleneck;
  protected clientGQ: GraphQLClient;
  constructor(protected config: IParserClientConfig) {
    super();

    this.limiter = new Bottleneck({
      minTime: 25,
      maxConcurrent: 25,
    });

    this.clientGQ = new GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl);
  }
}
