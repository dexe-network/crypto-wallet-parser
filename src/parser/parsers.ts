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

export abstract class ParserBase<ConfigType> {
  public rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[] = [];

  public parserProgress = new BehaviorSubject(0);

  protected getTransaction = new GetTransaction(this.services.etherscanService);
  protected parseTransaction = new ParseTransaction(this.services.uniswapService);
  protected filterTransaction = new FilterTransaction();
  protected transformTransaction = new TransformTransaction();
  protected tradesBuilderV2 = new TradesBuilderV2(this.services, this.config);
  protected calculateBalance = new CalculateBalance();
  protected calculateTransaction = new CalculateTransaction();

  constructor(protected services: IServices, protected config: IParserClientConfig) {}

  public async init(): Promise<void> {
    try {
      // set progress
      this.parserProgress.next(10);
      const initStep1 = await this.getTransaction.getAllTransactionByWalletAddress(this.config.correctWallet);
      const initStep2 = this.calculateBalance.buildBalance(initStep1, this.config.correctWallet);
      this.rawTransactions = initStep2;
    } catch (e) {
      this.parserProgress.complete();
      console.log('🔥 error: %o', e);
      throw e;
    }
  }

  public async process(): Promise<IDataProviderResult> {
    try {
      const rawTransactions = this.rawTransactions;
      if (!rawTransactions) {
        throw new Error('Etherscan transaction download error');
      }

      // set progress
      this.parserProgress.next(85);
      const transactionStep1 = await this.parseTransaction.parseTransactionBalancePrice(rawTransactions);
      // set progress
      this.parserProgress.next(98);
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

      this.parserProgress.complete();

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
      this.parserProgress.complete();
      console.log('🔥 error: %o', e);
      throw e;
    }
  }
}
