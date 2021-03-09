import Web3 from 'web3';
import Bottleneck from 'bottleneck';
import { ITransactionReceipt } from '../../interfaces/parser/parseWallet.interface';
import { IParserClientConfig } from '../../interfaces';
export default class Web3Service {
    web3js: Web3;
    limiter: Bottleneck;
    constructor(config: IParserClientConfig);
    private getTransactionReceipt;
    getTransactionReceiptLimiter(transactionHash: string): Promise<ITransactionReceipt>;
    getCurrentBlockNumberLimiter(): Promise<number>;
    private getCurrentBlockNumber;
}
