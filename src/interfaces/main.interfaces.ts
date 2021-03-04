import Web3Service from '../services/helpers/web3.service';
import { UniswapServiceApi, UniswapServiceClient } from '../services/outgoing/uniswap/uniswap.service';
import { EtherscanServiceApi, EtherscanServiceClient } from '../services/outgoing/etherscan.service';

export interface IParserClientConfig {
  correctWallet: string;
  env: {
    infuraUrl: string;
    infuraProjectId: string;
    uniswapGQLEndpointUrl: string;
    etherscanApiKey: string;
    etherscanApiUrl: string;
  };
}
export interface IParserApiConfig {
  correctWallet: string;
  lastCheckBlockNumber: number;
  startCheckBlockNumber: number;
  env: {
    infuraUrl: string;
    infuraProjectId: string;
    bottleneckRedisURL: string;
    uniswapGQLEndpointUrl: string;
    uniswapCacheRedisURL: string;
    etherscanApiKey: string;
    etherscanApiUrl: string;
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
