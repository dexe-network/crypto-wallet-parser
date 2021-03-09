import { IDataProviderResult, IGroupedTransactions, IParserClientConfig, IServices, ITokenBalanceItemBase } from '../interfaces';
import { GetTransaction } from './helpers/getTransaction';
import { ParseTransaction } from './helpers/parseTransaction';
import { FilterTransaction } from './helpers/filterTransaction';
import { TransformTransaction } from './helpers/transformTransaction';
import { TradesBuilderV2 } from './helpers/tradesBuilderV2';
import { CalculateBalance } from './helpers/calculateBalance';
import { CalculateTransaction } from './helpers/calculateTransaction';
export declare abstract class ParserBase<ConfigType> {
    protected services: IServices;
    abstract config: IParserClientConfig;
    rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[];
    protected getTransaction: GetTransaction;
    protected parseTransaction: ParseTransaction;
    protected filterTransaction: FilterTransaction;
    protected transformTransaction: TransformTransaction;
    protected tradesBuilderV2: TradesBuilderV2;
    protected calculateBalance: CalculateBalance;
    protected calculateTransaction: CalculateTransaction;
    constructor(services: IServices);
    init(): Promise<void>;
    process(): Promise<IDataProviderResult>;
}
