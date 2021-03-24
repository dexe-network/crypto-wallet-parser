import Web3Service from '../services/helpers/web3.service';
import { UniswapServiceClient } from '../services/outgoing/uniswap/uniswap.browser.service';
import { UniswapServiceApi } from '../services/outgoing/uniswap/uniswap.main.service';
import { EtherscanServiceClient } from '../services/outgoing/etherscan/etherscan.service.browser';
import { EtherscanServiceApi } from '../services/outgoing/etherscan/etherscan.service.main';

export enum PARSER_MODE {
  Wallet,
  W2W,
}

export enum NETWORK_TYPE {
  ETH = "ETH",
  BNB = "BNB"
}

export interface IParserClientConfig {
  parserMode: PARSER_MODE;
  correctWallet: string;

  env: {
    infuraProjectId: string;
    explorerApiKey: string;
    network: NETWORK_TYPE;
  };
}

export interface IParserApiConfig {
  parserMode: PARSER_MODE;
  correctWallet: string;
  lastCheckBlockNumber: number;
  startCheckBlockNumber: number;
  env: {
    infuraProjectId: string;
    bottleneckRedisURL: string;
    uniswapCacheRedisURL: string;
    explorerApiKey: string;
    network: NETWORK_TYPE;
  };
}

export interface IServices {
  web3Service: Web3Service;
  uniswapService: UniswapServiceClient | UniswapServiceApi;
  etherscanService: EtherscanServiceClient | EtherscanServiceApi;
}

export interface IServicesClient {
  web3Service: Web3Service;
  uniswapService: UniswapServiceClient;
  etherscanService: EtherscanServiceClient;
}

export interface IServicesApi {
  web3Service: Web3Service;
  uniswapService: UniswapServiceApi;
  etherscanService: EtherscanServiceApi;
}
