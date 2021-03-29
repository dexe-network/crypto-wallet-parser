import { IGroupedTransactions, ITokenBalanceItem, ITokenBalanceItemBase } from '../../interfaces/etherscan.interfaces';
import { UniswapServiceApi } from '../../services/outgoing/uniswap/uniswap.main.service';
import { UniswapServiceClient } from '../../services/outgoing/uniswap/uniswap.browser.service';
import { ICacheRequestData } from '../../interfaces/parser/transformTransaction.interface';
export declare class ParseTransaction {
    private uniswapService;
    constructor(uniswapService: UniswapServiceApi | UniswapServiceClient);
    private parseTransactionBalancePrice;
    parseTransactionBalancePriceSingle(transaction: IGroupedTransactions<ITokenBalanceItemBase>, parseBeforePrices?: boolean): Promise<IGroupedTransactions<ITokenBalanceItem>>;
    parsePriceAndStoreToCache(data: ICacheRequestData): Promise<void>;
}
