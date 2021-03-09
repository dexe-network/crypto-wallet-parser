import { IGroupedTransactions, ITokenBalanceItem, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
import { UniswapServiceApi } from '../../services/outgoing/uniswap/uniswap.main.service';
import { UniswapServiceClient } from '../../services/outgoing/uniswap/uniswap.browser.service';
export declare class ParseTransaction {
    private uniswapService;
    constructor(uniswapService: UniswapServiceApi | UniswapServiceClient);
    parseTransactionBalancePrice(transactions: IGroupedTransactions<ITokenBalanceItemBase>[]): Promise<IGroupedTransactions<ITokenBalanceItem>[]>;
}
