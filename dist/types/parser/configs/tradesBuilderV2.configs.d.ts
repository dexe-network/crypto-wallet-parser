import { IParserClientConfig } from '../../interfaces';
export interface ITradesBuilderV2BehaviourConfig {
    isTrustedProviderPattern: IisTrustedProviderPattern;
}
interface IisTrustedProviderPattern {
    first: boolean;
    second: boolean;
    third: boolean;
}
export declare const generateBehaviourConfig: (config: IParserClientConfig) => ITradesBuilderV2BehaviourConfig;
export {};
