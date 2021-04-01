import { IParserApiConfig, IServicesApi } from '../interfaces';
import { ParserBase } from './parsers';
export declare class ParserApi extends ParserBase<IParserApiConfig, IServicesApi> {
    config: IParserApiConfig;
    constructor(config: IParserApiConfig);
    init(): Promise<void>;
    hasNewTransactions(): boolean;
}
