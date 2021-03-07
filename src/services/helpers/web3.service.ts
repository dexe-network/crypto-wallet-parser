import Web3 from 'web3';
import Bottleneck from 'bottleneck';
import { ITransactionReceipt } from '../../interfaces/parser/parseWallet.interface';
import { IParserClientConfig } from '../../interfaces';
import defaultConfig from '../../constants/defaultConfig';

export default class Web3Service {
  web3js: Web3;
  limiter: Bottleneck;

  constructor(config: IParserClientConfig) {
    this.limiter = new Bottleneck({
      minTime: 25,
    });

    this.web3js = new Web3(new Web3.providers.HttpProvider(`${defaultConfig.infuraUrl}/${config.env.infuraProjectId}`));
  }

  private getTransactionReceipt(transactionHash: string): Promise<ITransactionReceipt> {
    // @ts-ignore
    return this.web3js.eth.getTransactionReceipt(transactionHash);
  }

  public getTransactionReceiptLimiter(transactionHash: string): Promise<ITransactionReceipt> {
    return this.limiter.schedule(() => this.getTransactionReceipt(transactionHash));
  }

  public getCurrentBlockNumberLimiter(): Promise<number> {
    return this.limiter.schedule(() => this.getCurrentBlockNumber());
  }

  private getCurrentBlockNumber(): Promise<number> {
    return this.web3js.eth.getBlockNumber();
  }
}
