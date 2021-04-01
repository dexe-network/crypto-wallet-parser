import { IParserClientConfig, PARSER_MODE } from '../../interfaces';

export interface ITradesBuilderV2BehaviourConfig {
  isTrustedProviderPattern: IisTrustedProviderPattern;
}

interface IisTrustedProviderPattern {
  first: boolean;
  second: boolean;
  third: boolean;
}

const generateIsTrustedProviderPattern = (config: IParserClientConfig): IisTrustedProviderPattern => {
  if (config.parserMode === PARSER_MODE.W2W) {
    return {
      first: true,
      second: false,
      third: true,
    };
  } else {
    return {
      first: true,
      second: false,
      third: false,
    };
  }
};

export const generateBehaviourConfig = (config: IParserClientConfig): ITradesBuilderV2BehaviourConfig => {
  return {
    isTrustedProviderPattern: generateIsTrustedProviderPattern(config),
  };
};

export const virtualTradeBlockNumberOffset = 50;
