import {
  IERC20Transaction,
  IERC721Transaction,
  IGroupedTransactions,
  IInternalTransaction,
  INormalTransaction,
  ITokenBalanceInfo,
  ITokenBalanceItem,
} from '../../interfaces/etherscan.interfaces';
import { IBalanceLookupResult } from '../../interfaces/parser/calculateBalance.interface';
import { ethDefaultInfo, wethDefaultInfo } from '../../constants/tokenInfo';
import BigNumber from 'bignumber.js';
import { buildBalanceTransformer } from '../../helpers/tokens.helper';

export class CalculateBalance {
  public buildBalance(data: IGroupedTransactions[], wallet: string): IGroupedTransactions[] {
    return data.reduce<IGroupedTransactions[]>((accumulatorValue, currentItem, index, array) => {
      const balanceLookupResult = this.balanceLookup(currentItem, accumulatorValue[index - 1]?.balance, wallet);
      const lookupResult = this.tokenContractAddressMigrateHandler(balanceLookupResult);
      const result: IGroupedTransactions = {
        ...currentItem,
        balance: lookupResult.balance,
        feeInETH: buildBalanceTransformer(lookupResult.feeInETH, +ethDefaultInfo.decimals),
        blockNumber: lookupResult.blockNumber,
        previousTransactionBlockNumber: accumulatorValue[index - 1]?.blockNumber
          ? accumulatorValue[index - 1].blockNumber
          : lookupResult.blockNumber,
        balanceBeforeTransaction: accumulatorValue[index - 1]?.balance
          ? accumulatorValue[index - 1].balance
          : lookupResult.balance,
        hash: lookupResult.hash,
        timeStamp: lookupResult.timeStamp,
      };
      accumulatorValue.push(result);
      return accumulatorValue;
    }, []);
    // Clean Zero Balances for decrease uni balance requests - if enable this crash logic when previous balance 7 current 0 (more info in notes)
    // .map((x) => {
    //   x.balance = pickBy(x.balance, this.filterTokenWIthZeroBalance);
    //   x.balanceBeforeTransaction = pickBy(x.balanceBeforeTransaction, this.filterTokenWIthZeroBalance);
    //   return x;
    // });
  }

  private tokenContractAddressMigrateHandler(data: IBalanceLookupResult): IBalanceLookupResult {
    for (const token of Object.values(data.balance).reverse()) {
      if (token.amount.isLessThan(0) && data.balance[token.address]) {
        const oldContractToken = Object.values(data.balance).find(
          (x) => x.symbol === token.symbol && x.address !== token.address,
        );
        if (oldContractToken) {
          data.balance[token.address].amount = data.balance[token.address].amount.plus(oldContractToken.amount);
          delete data.balance[oldContractToken.address];
        }
      }
    }
    return data;
  }

  private filterTokenWIthZeroBalance(token: ITokenBalanceItem): boolean {
    if (token.amount.isLessThanOrEqualTo(0)) {
      return false;
    } else {
      return true;
    }
  }

  private balanceLookup(
    data: IGroupedTransactions,
    previousBalance: ITokenBalanceInfo,
    wallet: string,
  ): IBalanceLookupResult {
    const localPreviousBalance = { ...previousBalance } || {};
    const result = Object.keys(data).reduce<IBalanceLookupResult>(
      (accum, value) => {
        if (value === 'normalTransactions' && data[value]) {
          this.balanceAndFeeFromNormal(data[value], accum, wallet, data);
          return accum;
        }

        if (value === 'internalTransactions' && data[value]) {
          this.balanceInternal(data[value], accum, wallet, data);
          return accum;
        }

        if (value === 'erc20Transactions' && data[value]) {
          this.erc20Balance(data[value], accum, wallet, data);
          return accum;
        }

        if (value === 'erc721Transactions' && data[value]) {
          return accum;
        }

        return accum;
      },
      { balance: { ...localPreviousBalance }, feeInETH: new BigNumber(0), blockNumber: 0, hash: '0', timeStamp: '0' },
    );
    // Minus Fee Operation
    // MINUS Transaction FEE from main eth balance
    if (result.feeInETH.isGreaterThan(0)) {
      result.balance[ethDefaultInfo.address].amount = result.balance[ethDefaultInfo.address].amount.minus(
        result.feeInETH,
      );
    }

    return result;
  }

  private erc20Balance(
    data: IERC20Transaction[],
    accum: IBalanceLookupResult,
    wallet: string,
    transactionGroup: IGroupedTransactions,
  ): void {
    for (const item of data) {
      accum.blockNumber = +item.blockNumber;
      accum.hash = item.hash;
      accum.timeStamp = item.timeStamp;

      const contractAddress = item.contractAddress.toLowerCase();
      if (!accum.balance[contractAddress]) {
        accum.balance[contractAddress] = {
          address: contractAddress,
          decimals: item.tokenDecimal,
          name: item.tokenName,
          symbol: item.tokenSymbol,
          amount: new BigNumber(0),
        };
      }

      // OUT Operation
      if (item.from.toLowerCase() === wallet) {
        accum.balance[contractAddress] = {
          ...accum.balance[contractAddress],
          amount: accum.balance[contractAddress].amount.minus(new BigNumber(item.value)),
        };

        accum.feeInETH = new BigNumber(item.gasUsed).multipliedBy(new BigNumber(item.gasPrice));

        // Catch transaction from contract
        // ( if transaction from contract and user as contract owner fee write from contract balance )
        if (!transactionGroup['normalTransactions']) {
          accum.feeInETH = new BigNumber(0);
        }
      }

      // In Operation
      if (item.to.toLowerCase() === wallet) {
        accum.balance[contractAddress] = {
          ...accum.balance[contractAddress],
          amount: accum.balance[contractAddress].amount.plus(new BigNumber(item.value)),
        };
      }
    }
  }

  private balanceInternal(
    data: IInternalTransaction[],
    accum: IBalanceLookupResult,
    wallet: string,
    transactionGroup: IGroupedTransactions,
  ): void {
    if (!accum.balance[ethDefaultInfo.address]) {
      accum.balance[ethDefaultInfo.address] = { ...ethDefaultInfo, amount: new BigNumber(0) };
    }

    for (const item of data) {
      accum.blockNumber = +item.blockNumber;
      accum.hash = item.hash;
      accum.timeStamp = item.timeStamp;
      // Catch Error Transactions and recalculate only fee
      if (item.isError === '1') {
        continue;
      }

      // OUT Operation
      if (item.from.toLowerCase() === wallet) {
        accum.balance[ethDefaultInfo.address] = {
          ...accum.balance[ethDefaultInfo.address],
          amount: accum.balance[ethDefaultInfo.address].amount.minus(new BigNumber(item.value)),
        };
      }

      // In Operation
      if (item.to.toLowerCase() === wallet) {
        accum.balance[ethDefaultInfo.address] = {
          ...accum.balance[ethDefaultInfo.address],
          amount: accum.balance[ethDefaultInfo.address].amount.plus(new BigNumber(item.value)),
        };

        // Catch WETH Unwrap
        if (
          !transactionGroup.erc20Transactions &&
          item.from.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        ) {
          accum.balance[item.from.toLowerCase()] = {
            ...accum.balance[item.from.toLowerCase()],
            amount: accum.balance[item.from.toLowerCase()].amount.minus(new BigNumber(item.value)),
          };
        }
      }
    }
  }

  private balanceAndFeeFromNormal(
    data: INormalTransaction[],
    accum: IBalanceLookupResult,
    wallet: string,
    transactionGroup: IGroupedTransactions,
  ): void {
    if (!accum.balance[ethDefaultInfo.address]) {
      accum.balance[ethDefaultInfo.address] = { ...ethDefaultInfo, amount: new BigNumber(0) };
    }

    for (const item of data) {
      accum.blockNumber = +item.blockNumber;
      accum.hash = item.hash;
      accum.timeStamp = item.timeStamp;
      // Catch Error Transactions and recalculate only fee
      if (item.isError === '1') {
        accum.feeInETH = new BigNumber(item.gasUsed).multipliedBy(new BigNumber(item.gasPrice));
        continue;
      }

      // OUT Operation
      if (item.from.toLowerCase() === wallet) {
        accum.balance[ethDefaultInfo.address] = {
          ...accum.balance[ethDefaultInfo.address],
          amount: accum.balance[ethDefaultInfo.address].amount.minus(new BigNumber(item.value)),
        };

        accum.feeInETH = new BigNumber(item.gasUsed).multipliedBy(new BigNumber(item.gasPrice));

        // Catch WETH for ETH->WETH transaction ETH WRAP to WETH
        if (item.to.toLowerCase() === wethDefaultInfo.address) {
          if (!accum.balance[wethDefaultInfo.address]) {
            accum.balance[wethDefaultInfo.address] = { ...wethDefaultInfo, amount: new BigNumber(0) };
          }

          accum.balance[wethDefaultInfo.address] = {
            ...accum.balance[wethDefaultInfo.address],
            amount: accum.balance[wethDefaultInfo.address].amount.plus(new BigNumber(item.value)),
          };
        }
      }

      // In Operation
      if (item.to.toLowerCase() === wallet) {
        accum.balance[ethDefaultInfo.address] = {
          ...accum.balance[ethDefaultInfo.address],
          amount: accum.balance[ethDefaultInfo.address].amount.plus(new BigNumber(item.value)),
        };
      }
    }
  }
}
