import {
  IERC20Transaction,
  IERC721Transaction,
  IGroupedTransactions,
  IGroupedTransactionsBase,
  IInternalTransaction,
  INormalTransaction,
  ITokenBalanceItemBase,
  ITransactionsHashTable,
} from '../../interfaces/etherscan.interfaces';
import { uniq, sortBy } from 'lodash';
import { IEtherscanService } from '../../services/outgoing/etherscan.service'

export class GetTransaction {

  constructor(private etherscanApi: IEtherscanService) {

  }
  public async getAllTransactionByWalletAddress(wallet: string): Promise<IGroupedTransactionsBase[]> {
    const normalTransactions = await this.getNormalTransactions(wallet).then((res) =>
      this.arrayToObjectKeys<ITransactionsHashTable<INormalTransaction[]>>(res),
    );
    const internalTransactions = await this.getInternalTransactions(wallet).then((res) =>
      this.arrayToObjectKeys<ITransactionsHashTable<IInternalTransaction[]>>(res),
    );
    const erc20Transactions = await this.getERC20Transactions(wallet).then((res) =>
      this.arrayToObjectKeys<ITransactionsHashTable<IERC20Transaction[]>>(res),
    );
    const erc721Transactions = await this.getERC721Transactions(wallet).then((res) =>
      this.arrayToObjectKeys<ITransactionsHashTable<IERC721Transaction[]>>(res),
    );

    const hashes = uniq([
      ...Object.keys(normalTransactions),
      ...Object.keys(internalTransactions),
      ...Object.keys(erc20Transactions),
      ...Object.keys(erc721Transactions),
    ]);

    const arrOfHashes: IGroupedTransactionsBase[] = hashes.reduce<IGroupedTransactionsBase[]>((accum, value) => {
      const data: IGroupedTransactionsBase = {
        normalTransactions: normalTransactions[value],
        internalTransactions: internalTransactions[value],
        erc20Transactions: erc20Transactions[value],
        erc721Transactions: erc721Transactions[value],
      };
      accum.push(data);
      return accum;
    }, []);

    const result = arrOfHashes.sort(this.compareFunction);
    return result;
  }

  private compareFunction(a: IGroupedTransactionsBase, b: IGroupedTransactionsBase): number {
    const actualA = a.normalTransactions || a.internalTransactions || a.erc20Transactions || a.erc721Transactions;
    const actualB = b.normalTransactions || b.internalTransactions || b.erc20Transactions || b.erc721Transactions;
    if (+actualA[0].blockNumber > +actualB[0].blockNumber) {
      return 1;
    }

    if (+actualA[0].blockNumber < +actualB[0].blockNumber) {
      return -1;
    }

    // @ts-ignore
    if ((+actualA[0].transactionIndex || 0) > (+actualB[0].transactionIndex || 0)) {
      return 1;
    }

    // @ts-ignore
    if ((+actualA[0].transactionIndex || 0) < (+actualB[0].transactionIndex || 0)) {
      return -1;
    }

    return 0;
  }

  private async getNormalTransactions(wallet: string): Promise<INormalTransaction[]> {
    const result = [];
    let resultCount = 0;
    let page = 1;
    do {
      const resultPart = await this.etherscanApi
        .getNormalTransactions(wallet, { sort: 'asc', offset: 10000, page: page })
        .then((res) => res.result)
        .then((res) => {
          if (Array.isArray(res)) {
            return res;
          } else {
            throw new Error('Etherscan Rate Limit');
          }
        });
      resultCount = resultPart.length;
      result.push(...resultPart);
      page += 1;
    } while (resultCount >= 10000);

    return result;
  }

  private async getInternalTransactions(wallet: string): Promise<IInternalTransaction[]> {
    const result = [];
    let resultCount = 0;
    let page = 1;
    do {
      const resultPart = await this.etherscanApi
        .getInternalTransactions(wallet, { sort: 'asc', offset: 10000, page: page })
        .then((res) => res.result)
        .then((res) => {
          if (Array.isArray(res)) {
            return res;
          } else {
            throw new Error('Etherscan Rate Limit');
          }
        });
      resultCount = resultPart.length;
      result.push(...resultPart);
      page += 1;
    } while (resultCount >= 10000);

    return result;
  }

  private async getERC20Transactions(wallet: string): Promise<IERC20Transaction[]> {
    const result = [];
    let resultCount = 0;
    let page = 1;
    do {
      const resultPart = await this.etherscanApi
        .getERC20Transactions(wallet, { sort: 'asc', offset: 10000, page: page })
        .then((res) => res.result)
        .then((res) => {
          if (Array.isArray(res)) {
            return res;
          } else {
            throw new Error('Etherscan Rate Limit');
          }
        });
      resultCount = resultPart.length;
      result.push(...resultPart);
      page += 1;
    } while (resultCount >= 10000);

    return result;
  }

  private async getERC721Transactions(wallet: string): Promise<IERC721Transaction[]> {
    const result = [];
    let resultCount = 0;
    let page = 1;
    do {
      const resultPart = await this.etherscanApi
        .getERC721Transactions(wallet, { sort: 'asc', offset: 10000, page: page })
        .then((res) => res.result)
        .then((res) => {
          if (Array.isArray(res)) {
            return res;
          } else {
            throw new Error('Etherscan Rate Limit');
          }
        });
      resultCount = resultPart.length;
      result.push(...resultPart);
      page += 1;
    } while (resultCount >= 10000);

    return result;
  }

  private arrayToObjectKeys<T>(data: T[] | any): T {
    return data.reduce((accum: { [x: string]: any[] }, value: { hash: string | number }) => {
      if (accum[value.hash]) {
        accum[value.hash].push(value);
      } else {
        accum[value.hash] = [];
        accum[value.hash].push(value);
      }
      return accum;
    }, {});
  }
}
