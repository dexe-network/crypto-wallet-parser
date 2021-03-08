import { IParserClientConfig, IServicesClient } from '../interfaces';
import Web3Service from '../services/helpers/web3.service';
import { ParserBase } from './parsers';
import { UniswapServiceClient } from '../services/outgoing/uniswap/uniswap.browser.service';
import { EtherscanServiceClient } from '../services/outgoing/etherscan/etherscan.service.browser';

export class ParserClient extends ParserBase<IParserClientConfig> {
  constructor(public config: IParserClientConfig) {
    super({
      web3Service: new Web3Service(config),
      uniswapService: new UniswapServiceClient(config),
      etherscanService: new EtherscanServiceClient(config),
    } as IServicesClient);
  }
}
