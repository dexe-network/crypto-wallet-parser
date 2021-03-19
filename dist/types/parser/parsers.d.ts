import { IDataProviderResult, IGroupedTransactions, IParserClientConfig, IServices, ITokenBalanceItemBase } from '../interfaces';
import { GetTransaction } from './helpers/getTransaction';
import { ParseTransaction } from './helpers/parseTransaction';
import { FilterTransaction } from './helpers/filterTransaction';
import { TransformTransaction } from './helpers/transformTransaction';
import { TradesBuilderV2 } from './helpers/tradesBuilderV2';
import { CalculateBalance } from './helpers/calculateBalance';
import { CalculateTransaction } from './helpers/calculateTransaction';
import { BehaviorSubject } from 'rxjs';
export declare abstract class ParserBase<ConfigType> {
    protected services: IServices;
    protected config: IParserClientConfig;
    rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[];
    parserProgress: BehaviorSubject<number>;
    uniswapRequestCount: import("rxjs").Observable<number>;
    protected getTransaction: GetTransaction;
    protected parseTransaction: ParseTransaction;
    protected filterTransaction: FilterTransaction;
    protected transformTransaction: TransformTransaction;
    protected tradesBuilderV2: TradesBuilderV2;
    protected calculateBalance: CalculateBalance;
    protected calculateTransaction: CalculateTransaction;
    constructor(services: IServices, config: IParserClientConfig);
    init(): Promise<void>;
    process(): Promise<IDataProviderResult>;
}
