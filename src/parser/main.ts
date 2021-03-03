import { GetTransaction } from './helpers/getTransaction';
import { ParseTransaction } from './helpers/parseTransaction';
import { FilterTransaction } from './helpers/filterTransaction';
import { TransformTransaction } from './helpers/transformTransaction';
import { CalculateTransaction } from './helpers/calculateTransaction';
import { IDataProviderResult } from '../interfaces/parser/parseWallet.interface';
import { IGetCurrentWalletBalanceResult, ITotalIndicators } from '../interfaces/parser/calculateTransaction.interface';
import { Logger } from 'winston';
import LoggerInstance from '../helpers/logger';
import { TradesBuilderV2 } from './helpers/tradesBuilderV2';
import { IGroupedTransactions, ITokenBalanceItemBase } from '../interfaces/etherscan.interfaces';
import { CalculateBalance } from './helpers/calculateBalance';
import UniswapService from '../services/outgoing/uniswap/uniswap.service';
import { ISourceInitData } from '../interfaces/parser/commonJob.interface';

export class Parser {
  private logger: Logger = LoggerInstance;
  private uniswapService: UniswapService;

  public rawTransactions: IGroupedTransactions<ITokenBalanceItemBase>[] = [];

  private getTransaction = new GetTransaction();
  private parseTransaction = new ParseTransaction();
  private filterTransaction = new FilterTransaction();
  private transformTransaction = new TransformTransaction();
  private tradesBuilderV2 = new TradesBuilderV2();
  private calculateBalance = new CalculateBalance();
  private calculateTransaction = new CalculateTransaction();

  constructor(private data: ISourceInitData) {
    this.uniswapService = Container.get(UniswapService);
  }

  public async init(): Promise<void> {
    try {
      const initStep1 = await this.getTransaction.getAllTransactionByWalletAddress(this.data.correctWallet);

      const initStep2 = this.calculateBalance.buildBalance(initStep1, this.data.correctWallet);

      // Filter Transaction by block number (check only trans after registration)
      const initStep3 = this.filterTransaction.filterAfterRegistration(initStep2, this.data.startCheckBlockNumber);

      this.rawTransactions = initStep3;
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      throw e;
    }
  }

  public hasNewTransactions(): boolean {
    const data = this.filterTransaction.filterAfterRegistration(this.rawTransactions, this.data.lastCheckBlockNumber);
    return data.length > 0;
  }

  public async process(): Promise<IDataProviderResult> {
    try {
      const rawTransactions = this.rawTransactions;
      if (!rawTransactions) {
        throw new Error('Etherscan transaction download error');
      }
      // Build Balance for every Transaction
      const transactionStep1 = await this.parseTransaction.parseTransactionBalancePrice(rawTransactions);

      // Build Trades
      const transactionStep2 = await this.tradesBuilderV2.buildTrades(transactionStep1);

      // Transform All Trades to SIngle Array and sort
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
