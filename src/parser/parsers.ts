import { Logger } from 'winston';
import LoggerInstance from '../helpers/logger';
import {
  IDataProviderResult,
  IGetCurrentWalletBalanceResult,
  IGroupedTransactions,
  IParserApiConfig,
  IParserClientConfig,
  IServices,
  IServicesApi,
  IServicesClient,
  ISourceInitData,
  ITokenBalanceItemBase,
  ITotalIndicators,
} from '../interfaces';
import { GetTransaction } from './helpers/getTransaction';
import { ParseTransaction } from './helpers/parseTransaction';
import { FilterTransaction } from './helpers/filterTransaction';
import { TransformTransaction } from './helpers/transformTransaction';
import { TradesBuilderV2 } from './helpers/tradesBuilderV2';
import { CalculateBalance } from './helpers/calculateBalance';
import { CalculateTransaction } from './helpers/calculateTransaction';
import Web3Service from '../services/helpers/web3.service';
import { UniswapServiceApi, UniswapServiceClient } from '../services/outgoing/uniswap/uniswap.service';
import { EtherscanServiceApi, EtherscanServiceClient } from '../services/outgoing/etherscan.service';

abstract class ParserBase<ConfigType> {
  abstract config: IParserClientConfig;

  protected logger: Logger = LoggerInstance;

  public rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[] = [];

  protected getTransaction = new GetTransaction(this.services.etherscanService);
  protected parseTransaction = new ParseTransaction(this.services.uniswapService);
  protected filterTransaction = new FilterTransaction();
  protected transformTransaction = new TransformTransaction();
  protected tradesBuilderV2 = new TradesBuilderV2(this.services);
  protected calculateBalance = new CalculateBalance();
  protected calculateTransaction = new CalculateTransaction();

  constructor(protected services: IServices) {}

  public async init(): Promise<void> {
    try {
      const initStep1 = await this.getTransaction.getAllTransactionByWalletAddress(this.config.correctWallet);
      const initStep2 = this.calculateBalance.buildBalance(initStep1, this.config.correctWallet);
      this.rawTransactions = initStep2;
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      throw e;
    }
  }

  public async process(): Promise<IDataProviderResult> {
    try {
      const rawTransactions = this.rawTransactions;
      if (!rawTransactions) {
        throw new Error('Etherscan transaction download error');
      }

      const transactionStep1 = await this.parseTransaction.parseTransactionBalancePrice(rawTransactions);
      const transactionStep2 = await this.tradesBuilderV2.buildTrades(transactionStep1);
      const transactionStep3 = this.transformTransaction.transformTokenTradeObjectToArr(transactionStep2);

      // Calculate Statistic Data
      const currentDeposit: IGetCurrentWalletBalanceResult = this.calculateTransaction.getCurrentWalletBalance(
        transactionStep1[transactionStep1.length - 1],
      );
      const startDeposit: IGetCurrentWalletBalanceResult = this.calculateTransaction.getCurrentWalletBalance(
        transactionStep1[0],
      );

      const lastTransactionBlockNumber = transactionStep1[transactionStep1.length - 1].blockNumber;

      const transactionsCount = rawTransactions.length;
      const tradesCount = this.calculateTransaction.tradesCount(transactionStep3);
      const totalIndicators: ITotalIndicators = this.calculateTransaction.totalProfitLoss(transactionStep3);
      const totalPoints = this.calculateTransaction.totalPoints(transactionStep3);

      return {
        points: totalPoints,
        currentDeposit: currentDeposit,
        startDeposit: startDeposit,
        transactionsCount: transactionsCount,
        tradesCount: tradesCount,
        totalIndicators: totalIndicators,
        lastCheckBlockNumber: lastTransactionBlockNumber,
        trades: transactionStep3,
      };
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      throw e;
    }
  }
}

export class ParserClient extends ParserBase<IParserClientConfig> {
  constructor(public config: IParserClientConfig) {
    super({
      web3Service: new Web3Service(config),
      uniswapService: new UniswapServiceClient(config),
      etherscanService: new EtherscanServiceClient(config),
    } as IServicesClient);
  }
}

export class ParserApi extends ParserBase<IParserApiConfig> {
  constructor(public config: IParserApiConfig) {
    super({
      web3Service: new Web3Service(config),
      uniswapService: new UniswapServiceApi(config),
      etherscanService: new EtherscanServiceApi(config),
    } as IServicesApi);
  }

  public async init(): Promise<void> {
    await super.init();
    const initStep3 = this.filterTransaction.filterAfterRegistration(
      this.rawTransactions,
      this.config.startCheckBlockNumber,
    );
    this.rawTransactions = initStep3;
  }

  public hasNewTransactions(): boolean {
    const data = this.filterTransaction.filterAfterRegistration(this.rawTransactions, this.config.lastCheckBlockNumber);
    return data.length > 0;
  }
}
