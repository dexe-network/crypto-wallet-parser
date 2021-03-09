import Bottleneck from 'bottleneck';
import { IParserApiConfig } from '../../../interfaces';
import { EtherscanService } from './etherscan.service';
export declare class EtherscanServiceApi extends EtherscanService {
    protected config: IParserApiConfig;
    private redis;
    protected limiter: Bottleneck;
    constructor(config: IParserApiConfig);
}
