import { IGroupedTransactionsBase } from '../../interfaces/etherscan.interfaces';
import { EtherscanServiceClient } from '../../services/outgoing/etherscan/etherscan.service.browser';
import { EtherscanServiceApi } from '../../services/outgoing/etherscan/etherscan.service.main';
export declare class GetTransaction {
    private etherscanApi;
    constructor(etherscanApi: EtherscanServiceClient | EtherscanServiceApi);
    getAllTransactionByWalletAddress(wallet: string): Promise<IGroupedTransactionsBase[]>;
    private compareFunction;
    private getNormalTransactions;
    private getInternalTransactions;
    private getERC20Transactions;
    private getERC721Transactions;
    private arrayToObjectKeys;
}
