import { IParserApiConfig, IServicesApi } from '../interfaces';
import Web3Service from '../services/helpers/web3.service';
import { ParserBase } from './parsers';
import { UniswapServiceApi } from '../services/outgoing/uniswap/uniswap.main.service';
import { EtherscanServiceApi } from '../services/outgoing/etherscan/etherscan.service.main';

export class ParserApi extends ParserBase<IParserApiConfig, IServicesApi> {
  constructor(public config: IParserApiConfig) {
    super(
      {
        web3Service: new Web3Service(config),
        uniswapService: new UniswapServiceApi(config),
        etherscanService: new EtherscanServiceApi(config),
      } as IServicesApi,
      config,
    );
  }

  public async init(): Promise<void> {
    await super.init();
    const initStep3 = this.filterTransaction.filterAfterRegistration(
      this.rawTransactions,
      this.config.startCheckBlockNumber,
    );
    this.rawTransactions = initStep3;
  }

  public hasNewTransactions(): boolean {
    const data = this.filterTransaction.filterAfterRegistration(this.rawTransactions, this.config.lastCheckBlockNumber);
    return data.length > 0;
  }
}
