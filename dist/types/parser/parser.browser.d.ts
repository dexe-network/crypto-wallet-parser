import { IParserClientConfig } from '../interfaces';
import { ParserBase } from './parsers';
export declare class ParserClient extends ParserBase<IParserClientConfig> {
    config: IParserClientConfig;
    constructor(config: IParserClientConfig);
}
