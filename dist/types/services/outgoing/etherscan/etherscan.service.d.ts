import Bottleneck from 'bottleneck';
import { IERC20Transaction, IERC721Transaction, IEtherscanParams, IEtherscanResponse, IInternalTransaction, INormalTransaction } from '../../../interfaces/etherscan.interfaces';
import { IParserClientConfig } from '../../../interfaces';
export declare abstract class EtherscanService {
    protected abstract limiter: Bottleneck;
    protected abstract config: IParserClientConfig;
    getNormalTransactions(walletAddress: string, paramsValues: IEtherscanParams): Promise<IEtherscanResponse<INormalTransaction[]>>;
    private getNormalTransactionsRaw;
    getInternalTransactions(walletAddress: string, paramsValues: IEtherscanParams): Promise<IEtherscanResponse<IInternalTransaction[]>>;
    private getInternalTransactionsRaw;
    getERC20Transactions(walletAddress: string, paramsValues: IEtherscanParams): Promise<IEtherscanResponse<IERC20Transaction[]>>;
    private getERC20TransactionsRaw;
    getERC721Transactions(walletAddress: string, paramsValues: IEtherscanParams): Promise<IEtherscanResponse<IERC721Transaction[]>>;
    private getERC721TransactionsRaw;
}
