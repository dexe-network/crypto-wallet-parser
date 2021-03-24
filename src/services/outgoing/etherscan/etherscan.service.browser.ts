import Bottleneck from 'bottleneck';
import { IParserClientConfig, NETWORK_TYPE } from '../../../interfaces';
import { EtherscanService } from './etherscan.service';

export class EtherscanServiceClient extends EtherscanService {
  protected limiter: Bottleneck;
  protected network: NETWORK_TYPE;

  constructor(protected config: IParserClientConfig) {
    super();
    this.initNetwork(config)
    this.limiter = new Bottleneck({
      minTime: 300,
    });
  }

  private initNetwork(config: IParserClientConfig): void {
    if (config.env.network in NETWORK_TYPE) {
      this.network = config.env.network
    } else {
      throw new Error('Wrong network');
    }
  }
}
