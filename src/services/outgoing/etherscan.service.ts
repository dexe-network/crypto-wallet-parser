import Bottleneck from 'bottleneck';
import Axios, { AxiosResponse } from 'axios';
import {
  IERC20Transaction,
  IERC721Transaction,
  IEtherscanParams,
  IEtherscanResponse,
  IInternalTransaction,
  INormalTransaction,
} from '../../interfaces/etherscan.interfaces';
import { toQueryString } from '../../helpers/http.helper';
import IORedis from 'ioredis';
import { IParserApiConfig, IParserClientConfig } from '../../interfaces';
import defaultConfig from '../../constants/defaultConfig'

export type IEtherscanService = EtherscanServiceApi | EtherscanServiceClient;

abstract class EtherscanService {
  protected abstract limiter: Bottleneck;
  protected abstract config: IParserClientConfig;

  /// NORMAL

  public getNormalTransactions(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<INormalTransaction[]>> {
    return this.limiter.schedule<IEtherscanResponse<INormalTransaction[]>>(() =>
      this.getNormalTransactionsRaw(walletAddress, paramsValues),
    );
  }

  private getNormalTransactionsRaw(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<INormalTransaction[]>> {
    const baseValues = {
      address: walletAddress,
      apikey: this.config.env.etherscanApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<INormalTransaction[]>>(
      `${defaultConfig.etherscanApiUrl}account&action=txlist&${queryParams}`,
    ).then((res) => res.data);
  }

  /// INTERNAL

  public getInternalTransactions(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<IInternalTransaction[]>> {
    return this.limiter.schedule<IEtherscanResponse<IInternalTransaction[]>>(() =>
      this.getInternalTransactionsRaw(walletAddress, paramsValues),
    );
  }

  private getInternalTransactionsRaw(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<IInternalTransaction[]>> {
    const baseValues: IEtherscanParams = {
      address: walletAddress,
      apikey: this.config.env.etherscanApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<IInternalTransaction[]>>(
      `${defaultConfig.etherscanApiUrl}account&action=txlistinternal&${queryParams}`,
    ).then((res) => res.data);
  }

  /// ERC20

  public getERC20Transactions(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<IERC20Transaction[]>> {
    return this.limiter.schedule<IEtherscanResponse<IERC20Transaction[]>>(() =>
      this.getERC20TransactionsRaw(walletAddress, paramsValues),
    );
  }

  private getERC20TransactionsRaw(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<IERC20Transaction[]>> {
    const baseValues: IEtherscanParams = {
      address: walletAddress,
      apikey: this.config.env.etherscanApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<IERC20Transaction[]>>(
      `${defaultConfig.etherscanApiUrl}account&action=tokentx&${queryParams}`,
    ).then((res) => res.data);
  }

  /// ERC721

  public getERC721Transactions(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<IERC721Transaction[]>> {
    return this.limiter.schedule<IEtherscanResponse<IERC721Transaction[]>>(() =>
      this.getERC721TransactionsRaw(walletAddress, paramsValues),
    );
  }

  private getERC721TransactionsRaw(
    walletAddress: string,
    paramsValues: IEtherscanParams,
  ): Promise<IEtherscanResponse<IERC721Transaction[]>> {
    const baseValues: IEtherscanParams = {
      address: walletAddress,
      apikey: this.config.env.etherscanApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<IERC721Transaction[]>>(
      `${defaultConfig.etherscanApiUrl}account&action=tokennfttx&${queryParams}`,
    ).then((res) => res.data);
  }
}

export class EtherscanServiceClient extends EtherscanService {
  protected limiter: Bottleneck;

  constructor(protected config: IParserClientConfig) {
    super();
    this.limiter = new Bottleneck({
      minTime: 300,
    });
  }
}

export class EtherscanServiceApi extends EtherscanService {
  private redis: IORedis.Redis;
  protected limiter: Bottleneck;

  constructor(protected config: IParserApiConfig) {
    super();
    this.redis = new IORedis(this.config.env.bottleneckRedisURL);
    const connection = new Bottleneck.IORedisConnection({ client: this.redis });
    this.limiter = new Bottleneck({
      minTime: 450,
      id: 'etherscan',
      clearDatastore: true,
      datastore: 'ioredis',
      connection,
      Redis: IORedis,
    });
  }
}
