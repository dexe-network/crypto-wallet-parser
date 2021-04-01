import {
  IDataProviderResult,
  IGetCurrentWalletBalanceResult,
  IGroupedTransactions,
  IParserClientConfig,
  IServices,
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
import { BehaviorSubject } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { TradesBuilderV2Prebuild } from './helpers/tradesBuilderV2-prebuild';
import BigNumber from 'bignumber.js';

export abstract class ParserBase<ConfigType, ServicesType extends IServices> {
  public rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[] = [];

  public parserProgress = new BehaviorSubject(0);
  public uniswapRequestCount = this.services.uniswapService.requestCounter.asObservable().pipe(auditTime(1000));
  public estimatedUniswapRequests = new BehaviorSubject(0);

  protected getTransaction = new GetTransaction(this.services.etherscanService);
  protected parseTransaction = new ParseTransaction(this.services.uniswapService);
  protected filterTransaction = new FilterTransaction();
  protected transformTransaction = new TransformTransaction();
  protected tradesBuilderV2 = new TradesBuilderV2(this.services, this.config);
  protected tradesBuilderV2Prebuild = new TradesBuilderV2Prebuild(this.services, this.config);
  protected calculateBalance = new CalculateBalance();
  protected calculateTransaction = new CalculateTransaction();

  constructor(public services: ServicesType, protected config: IParserClientConfig) {}

  public async init(): Promise<void> {
    try {
      // set progress
      this.parserProgress.next(10);
      const initStep1 = await this.getTransaction.getAllTransactionByWalletAddress(this.config.correctWallet);
      const initStep2 = this.calculateBalance.buildBalance(initStep1, this.config.correctWallet);
      this.rawTransactions = initStep2;
    } catch (e) {
      this.completeStreams();
      console.log('🔥 error: %o', e);
      throw e;
    }
  }

  public async process(): Promise<IDataProviderResult> {
    try {
      const rawTransactions = this.rawTransactions;
      if (!rawTransactions || rawTransactions.length <= 0) {
        this.completeStreams();
        return this.noTransactionsResult();
      }

      const currentBlockNumber = await this.services.web3Service.getCurrentBlockNumberLimiter();
      const preBuildTrades = await this.tradesBuilderV2Prebuild.buildTrades(rawTransactions, currentBlockNumber);
      const cacheRequestData = this.transformTransaction.buildCacheRequestData(preBuildTrades, rawTransactions);
      this.estimatedUniswapRequests.next(cacheRequestData.requestsCount);

      // set progress
      this.parserProgress.next(85);
      await this.parseTransaction.parsePriceAndStoreToCache(cacheRequestData);
      // const transactionStep1 = await this.parseTransaction.parseTransactionBalancePrice(rawTransactions);

      // set progress
      this.parserProgress.next(98);
      const transactionStep2 = await this.tradesBuilderV2.buildTrades(rawTransactions, currentBlockNumber);
      const transactionStep3 = this.transformTransaction.transformTokenTradeObjectToArr(transactionStep2);

      // Calculate Statistic Data
      const currentDeposit: IGetCurrentWalletBalanceResult = this.calculateTransaction.getCurrentWalletBalance(
        await this.parseTransaction.parseTransactionBalancePriceSingle(rawTransactions[rawTransactions.length - 1]),
      );
      const startDeposit: IGetCurrentWalletBalanceResult = this.calculateTransaction.getCurrentWalletBalance(
        await this.parseTransaction.parseTransactionBalancePriceSingle(rawTransactions[0]),
      );

      const lastTransactionBlockNumber = rawTransactions[rawTransactions.length - 1]?.blockNumber || 0;

      const transactionsCount = rawTransactions.length;
      const tradesCount = this.calculateTransaction.tradesCount(transactionStep3);
      const totalIndicators: ITotalIndicators = this.calculateTransaction.totalProfitLoss(transactionStep3);
      const totalPoints = this.calculateTransaction.totalPoints(transactionStep3);

      this.completeStreams();

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
      this.completeStreams();
      console.log('🔥 error: %o', e);
      throw e;
    }
  }

  private noTransactionsResult(): IDataProviderResult {
    return {
      points: new BigNumber(0),
      currentDeposit: {
        amountInETH: new BigNumber(0),
        amountInUSD: new BigNumber(0),
      },
      startDeposit: {
        amountInETH: new BigNumber(0),
        amountInUSD: new BigNumber(0),
      },
      transactionsCount: 0,
      tradesCount: 0,
      totalIndicators: {
        profitLoss: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
        profit: { fromETH: new BigNumber(0), fromUSD: new BigNumber(0) },
      },
      lastCheckBlockNumber: 0,
      trades: [],
    };
  }

  private completeStreams(): void {
    this.parserProgress.complete();
    this.services.uniswapService.requestCounter.complete();
    this.estimatedUniswapRequests.complete();
  }
}
