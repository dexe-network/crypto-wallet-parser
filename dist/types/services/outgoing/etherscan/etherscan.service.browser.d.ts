import Bottleneck from 'bottleneck';
import { IParserClientConfig } from '../../../interfaces';
import { EtherscanService } from './etherscan.service';
export declare class EtherscanServiceClient extends EtherscanService {
    protected config: IParserClientConfig;
    protected limiter: Bottleneck;
    constructor(config: IParserClientConfig);
}
