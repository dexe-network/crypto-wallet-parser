import Bottleneck from 'bottleneck';
import { IParserClientConfig } from '../../../interfaces';
import { EtherscanService } from './etherscan.service';

export class EtherscanServiceClient extends EtherscanService {
  protected limiter: Bottleneck;

  constructor(protected config: IParserClientConfig) {
    super();
    this.limiter = new Bottleneck({
      minTime: 300,
    });
  }
}
