import Bottleneck from 'bottleneck';
import Axios from 'axios';
import {
  IERC20Transaction,
  IERC721Transaction,
  IEtherscanParams,
  IEtherscanResponse,
  IInternalTransaction,
  INormalTransaction,
} from '../../../interfaces/etherscan.interfaces';
import { toQueryString } from '../../../helpers/http.helper';
import { IParserClientConfig, NETWORK_TYPE } from '../../../interfaces';
import defaultConfig from '../../../constants/defaultConfig';

export abstract class EtherscanService {
  protected abstract limiter: Bottleneck;
  protected abstract config: IParserClientConfig;
  protected abstract network: NETWORK_TYPE;

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
      apikey: this.config.env.explorerApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<INormalTransaction[]>>(
      `${defaultConfig[this.network].apiUrl}account&action=txlist&${queryParams}`,
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
      apikey: this.config.env.explorerApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<IInternalTransaction[]>>(
      `${defaultConfig[this.network].apiUrl}account&action=txlistinternal&${queryParams}`,
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
      apikey: this.config.env.explorerApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<IERC20Transaction[]>>(
      `${defaultConfig[this.network].apiUrl}account&action=tokentx&${queryParams}`,
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
      apikey: this.config.env.explorerApiKey,
      sort: 'asc',
    };
    const queryParams = toQueryString({ ...baseValues, ...paramsValues }, false);
    return Axios.get<IEtherscanResponse<IERC721Transaction[]>>(
      `${defaultConfig[this.network].apiUrl}account&action=tokennfttx&${queryParams}`,
    ).then((res) => res.data);
  }
}
