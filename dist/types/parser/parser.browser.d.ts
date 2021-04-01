import { IParserClientConfig, IServicesClient } from '../interfaces';
import { ParserBase } from './parsers';
export declare class ParserClient extends ParserBase<IParserClientConfig, IServicesClient> {
    config: IParserClientConfig;
    constructor(config: IParserClientConfig);
}
