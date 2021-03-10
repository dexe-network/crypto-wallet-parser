import Web3Service from '../services/helpers/web3.service';
import { UniswapServiceClient } from '../services/outgoing/uniswap/uniswap.browser.service';
import { UniswapServiceApi } from '../services/outgoing/uniswap/uniswap.main.service';
import { EtherscanServiceClient } from '../services/outgoing/etherscan/etherscan.service.browser';
import { EtherscanServiceApi } from '../services/outgoing/etherscan/etherscan.service.main';
export declare enum PARSER_MODE {
    Wallet = 0,
    W2W = 1
}
export interface IParserClientConfig {
    parserMode: PARSER_MODE;
    correctWallet: string;
    env: {
        infuraProjectId: string;
        etherscanApiKey: string;
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
        etherscanApiKey: string;
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
