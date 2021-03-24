import IORedis from 'ioredis';
import Bottleneck from 'bottleneck';
import { IParserApiConfig, NETWORK_TYPE } from '../../../interfaces';
import { EtherscanService } from './etherscan.service';

export class EtherscanServiceApi extends EtherscanService {
  private redis: IORedis.Redis;
  protected limiter: Bottleneck;
  protected network: NETWORK_TYPE;

  constructor(protected config: IParserApiConfig) {
    super();
    this.initNetwork(config)
    this.redis = new IORedis(this.config.env.bottleneckRedisURL);
    const connection = new Bottleneck.IORedisConnection({ client: this.redis });
    this.limiter = new Bottleneck({
      minTime: 450,
      id: 'etherscan',
      clearDatastore: true,
      datastore: 'ioredis',
      connection,
      Redis: IORedis,
    });
  }

  private initNetwork(config: IParserApiConfig): void {
    if (config.env.network in NETWORK_TYPE) {
      this.network = config.env.network
    } else {
      throw new Error('Wrong network');
    }
  }
}
