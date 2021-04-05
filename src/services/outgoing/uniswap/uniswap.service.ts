import Bottleneck from 'bottleneck';
import { GraphQLClient, gql } from 'graphql-request';
import {
  IArrTokenPriceCheckResult,
  ICheckTokenArrPriceInUSDandETHArguments,
  ICheckTokenArrPriceInUSDandETHResponse,
  IGetUniswapTransactionByIdArguments,
  ITokenPriceUSDETH,
  IUniswapRawTransaction,
} from '../../../interfaces/uniswap.interfaces';
import BigNumber from 'bignumber.js';
import { ethDefaultInfo, wethDefaultInfo } from '../../../constants/tokenInfo';
import {
  checkTokenArrPriceInUSDandETHByBlockNumber,
  checkTokenArrPriceInUSDandETHCurrent,
} from './uniswap.gqlRequests';
import { IParserClientConfig } from '../../../interfaces';
import { chunk } from 'lodash';
import defaultConfig from '../../../constants/defaultConfig';
import { BehaviorSubject } from 'rxjs';
import { UniswapCacheService } from '../../helpers/uniswapCache.service';
import { UniswapPrebuildCacheService } from '../../helpers/uniswapPrebuildCache.service';

export abstract class UniswapServiceBase {
  protected abstract limiter: Bottleneck;
  protected abstract clientGQ: GraphQLClient;
  protected abstract config: IParserClientConfig;
  protected abstract uniswapCacheService: UniswapCacheService | UniswapPrebuildCacheService;

  public requestCounter = new BehaviorSubject(0);

  public checkTokenPriceInUSDandETHLimiter(token: string, blockNumber?: number): Promise<ITokenPriceUSDETH> {
    return this.limiter.schedule<ITokenPriceUSDETH>(() => this.checkTokenPriceInUSDandETH(token, blockNumber));
  }

  public async checkTokenArrPriceInUSDandETHLimiter(
    argumentsData: ICheckTokenArrPriceInUSDandETHArguments,
  ): Promise<IArrTokenPriceCheckResult> {
    if (await this.uniswapCacheService.isExist(argumentsData)) {
      return this.uniswapCacheService.getData<IArrTokenPriceCheckResult>(argumentsData);
    }

    return this.limiter.schedule<IArrTokenPriceCheckResult>(() => this.checkTokenArrPriceInUSDandETH(argumentsData));
  }

  public async getUniswapTransactionByIdLimiter(
    argumentsData: IGetUniswapTransactionByIdArguments,
  ): Promise<IUniswapRawTransaction> {
    if (await this.uniswapCacheService.isExist(argumentsData)) {
      return this.uniswapCacheService.getData<IUniswapRawTransaction>(argumentsData);
    }

    return this.limiter.schedule<IUniswapRawTransaction>(() => this.getUniswapTransactionById(argumentsData));
  }

  protected async checkTokenArrPriceInUSDandETH(
    argumentsData: ICheckTokenArrPriceInUSDandETHArguments,
  ): Promise<IArrTokenPriceCheckResult> {
    try {
      const PAIR_SEARCH = gql`
        query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {
          usdc0: pairs(
            where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token1Price
            token0 {
              id
              symbol
            }
          }
          usdc1: pairs(
            where: { token1_in: $tokens, token0: $tokenUSDC, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token0Price
            token1 {
              id
              symbol
            }
          }
          weth0: pairs(
            where: { token0_in: $tokens, token1: $tokenWETH, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token1Price
            token0 {
              id
              symbol
            }
          }
          weth1: pairs(
            where: { token1_in: $tokens, token0: $tokenWETH, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token0Price
            token1 {
              id
              symbol
            }
          }
          ethPrice: bundles(block: { number: $blockNumber }) {
            ethPrice
          }
        }
      `;

      const tokensArrs: string[][] = chunk(
        argumentsData.tokens.map((item) => item.toLowerCase()),
        5,
      );
      const totalResult: ICheckTokenArrPriceInUSDandETHResponse = {
        usdc0: [],
        usdc1: [],
        weth0: [],
        weth1: [],
        ethPrice: [],
      };

      for (const tokens of tokensArrs) {
        let count = 0;
        const maxTries = 10;
        while (true) {
          const localController = new AbortController();
          const localClientGQ = new GraphQLClient(defaultConfig.uniswap.uniswapGQLEndpointUrl, {
            signal: localController.signal,
          });
          const variables = {
            tokens,
            tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            // UNISWAP NO DATA BEFORE 10009000 BLOCK
            blockNumber: argumentsData.blockNumber > 10009000 ? argumentsData.blockNumber : 10009000,
          };

          const requestTimeLimit = setTimeout(() => {
            localController.abort();
          }, 10000);

          try {
            const result: ICheckTokenArrPriceInUSDandETHResponse = await localClientGQ.request(PAIR_SEARCH, variables);
            clearTimeout(requestTimeLimit);
            this.requestCounter.next(this.requestCounter.value + 1);

            totalResult.ethPrice.push(...result.ethPrice);
            totalResult.usdc0.push(...result.usdc0);
            totalResult.usdc1.push(...result.usdc1);
            totalResult.weth0.push(...result.weth0);
            totalResult.weth1.push(...result.weth1);
            break;
          } catch (e) {
            clearTimeout(requestTimeLimit);
            console.log('retry price request');
            if (++count === maxTries) {
              throw e;
            }
          }
        }
      }

      const dataResult = argumentsData.tokens.reduce((accum, value, index) => {
        const token = value.toLowerCase();
        accum[value] = this.tokenPriceSwitcher(token, totalResult);
        return accum;
      }, {} as IArrTokenPriceCheckResult);

      // Write data to cache
      if (!(await this.uniswapCacheService.isExist(argumentsData))) {
        await this.uniswapCacheService.setData<IArrTokenPriceCheckResult>(argumentsData, dataResult);
      }

      return dataResult;
    } catch (e) {
      throw e;
    }
  }

  private async checkTokenPriceInUSDandETH(token: string, blockNumber?: number): Promise<ITokenPriceUSDETH> {
    let count = 0;
    const maxTries = 10;
    while (true) {
      try {
        const PAIR_SEARCH = blockNumber
          ? checkTokenArrPriceInUSDandETHByBlockNumber
          : checkTokenArrPriceInUSDandETHCurrent;

        const variables = {
          token: token.toLowerCase(),
          tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          blockNumber,
        };

        // // Check if Token for Check is USDC
        // if (variables.token.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
        //   return '1';
        // }

        const result = await this.clientGQ.request(PAIR_SEARCH, variables);
        this.requestCounter.next(this.requestCounter.value + 1);

        // Catch WETH and ETH price check
        if (token.toLowerCase() === ethDefaultInfo.address || token.toLowerCase() === wethDefaultInfo.address) {
          return {
            usdPer1Token: new BigNumber(result.ethPrice[0].ethPrice),
            ethPer1Token: new BigNumber(1),
            usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
          };
        }

        if (result?.weth0[0]?.token1Price) {
          return {
            usdPer1Token: new BigNumber(result?.weth0[0]?.token1Price).multipliedBy(
              new BigNumber(result?.ethPrice[0]?.ethPrice),
            ),
            ethPer1Token: new BigNumber(result?.weth0[0]?.token1Price),
            usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
          };
        }

        if (result?.weth1[0]?.token0Price) {
          return {
            usdPer1Token: new BigNumber(result?.weth1[0]?.token0Price).multipliedBy(
              new BigNumber(result?.ethPrice[0]?.ethPrice),
            ),
            ethPer1Token: new BigNumber(result?.weth1[0]?.token0Price),
            usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
          };
        }

        if (result?.usdc0[0]?.token1Price) {
          return {
            usdPer1Token: new BigNumber(result?.usdc0[0]?.token1Price),
            ethPer1Token: new BigNumber(result?.usdc0[0]?.token1Price).dividedBy(result?.ethPrice[0]?.ethPrice),
            usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
          };
        }

        if (result?.usdc1[0]?.token0Price) {
          return {
            usdPer1Token: new BigNumber(result?.usdc1[0]?.token0Price),
            ethPer1Token: new BigNumber(result?.usdc1[0]?.token0Price).dividedBy(result?.ethPrice[0]?.ethPrice),
            usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
          };
        }

        return {
          usdPer1Token: new BigNumber(0),
          ethPer1Token: new BigNumber(0),
          usdPer1ETH: new BigNumber(result.ethPrice[0].ethPrice),
        };
      } catch (e) {
        console.log('retry price request');
        if (++count === maxTries) {
          throw e;
        }
      }
    }
  }

  private async getUniswapTransactionById(
    argumentsData: IGetUniswapTransactionByIdArguments,
  ): Promise<IUniswapRawTransaction> {
    try {
      const query = gql`
      {
        swaps(where: { transaction: "${argumentsData.transactionId}" }) {
          id
          transaction {
            id
            blockNumber
            timestamp
          }
          timestamp
          pair {
            id
            token0 {
              id
              symbol
              name
              decimals
              totalSupply
              tradeVolume
              tradeVolumeUSD
              untrackedVolumeUSD
              txCount
              totalLiquidity
              derivedETH
            }
            token1 {
              id
              symbol
              name
              decimals
              totalSupply
              tradeVolume
              tradeVolumeUSD
              untrackedVolumeUSD
              txCount
              totalLiquidity
              derivedETH
            }
            volumeUSD
            untrackedVolumeUSD
          }
          sender
          amount0In
          amount1In
          amount0Out
          amount1Out
          to
          logIndex
          amountUSD
        }
        ethPrice: bundles(block: { number: ${argumentsData.blockNumber} }) {
          ethPrice
        }
      }
    `;
      const dataResult = await this.clientGQ.request<any>(query).then<IUniswapRawTransaction>((res) => {
        this.requestCounter.next(this.requestCounter.value + 1);
        if (!res.swaps[0]) {
          return undefined;
        }
        res.swaps[0].amountETH = new BigNumber(res.swaps[0].amountUSD).dividedBy(res?.ethPrice[0]?.ethPrice).toString();

        res.swaps[0].ethPrice = res.ethPrice[0].ethPrice;
        return res.swaps[0];
      });

      // Write data to cache
      if (!(await this.uniswapCacheService.isExist(argumentsData))) {
        await this.uniswapCacheService.setData<IUniswapRawTransaction>(argumentsData, dataResult);
      }

      return dataResult;
    } catch (e) {
      throw e;
    }
  }

  private tokenPriceSwitcher(token: string, data: ICheckTokenArrPriceInUSDandETHResponse): ITokenPriceUSDETH {
    const ethPrice = data.ethPrice[0].ethPrice;

    // Catch WETH and ETH price check
    if (token === ethDefaultInfo.address || token === wethDefaultInfo.address) {
      return {
        usdPer1Token: new BigNumber(ethPrice),
        ethPer1Token: new BigNumber(1),
        usdPer1ETH: new BigNumber(ethPrice),
      };
    }

    const weth0 = data.weth0.find((x) => x.token0.id === token);
    if (weth0?.token1Price) {
      return {
        usdPer1Token: new BigNumber(weth0.token1Price).multipliedBy(new BigNumber(ethPrice)),
        ethPer1Token: new BigNumber(weth0.token1Price),
        usdPer1ETH: new BigNumber(ethPrice),
      };
    }

    const weth1 = data.weth1.find((x) => x.token1.id === token);
    if (weth1?.token0Price) {
      return {
        usdPer1Token: new BigNumber(weth1.token0Price).multipliedBy(new BigNumber(ethPrice)),
        ethPer1Token: new BigNumber(weth1.token0Price),
        usdPer1ETH: new BigNumber(ethPrice),
      };
    }

    const usdc0 = data.usdc0.find((x) => x.token0.id === token);
    if (usdc0?.token1Price) {
      return {
        usdPer1Token: new BigNumber(usdc0.token1Price),
        ethPer1Token: new BigNumber(usdc0.token1Price).dividedBy(ethPrice),
        usdPer1ETH: new BigNumber(ethPrice),
      };
    }

    const usdc1 = data.usdc1.find((x) => x.token1.id === token);
    if (usdc1?.token0Price) {
      return {
        usdPer1Token: new BigNumber(usdc1.token0Price),
        ethPer1Token: new BigNumber(usdc1.token0Price).dividedBy(ethPrice),
        usdPer1ETH: new BigNumber(ethPrice),
      };
    }

    return {
      usdPer1Token: new BigNumber(0),
      ethPer1Token: new BigNumber(0),
      usdPer1ETH: new BigNumber(ethPrice),
    };
  }
}
