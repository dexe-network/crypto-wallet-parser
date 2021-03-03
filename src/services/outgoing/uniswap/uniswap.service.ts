import { Container, Service } from 'typedi';
import config from '../../../config';
import Bottleneck from 'bottleneck';
import { request, GraphQLClient, gql } from 'graphql-request';
import {
  IArrTokenPriceCheckResult,
  ICheckTokenArrPriceInUSDandETHArguments,
  ICheckTokenArrPriceInUSDandETHResponse,
  ITokenPriceUSDETH,
  IUniswapRawTransaction,
} from '../../../interfaces/uniswap.interfaces';
import BigNumber from 'bignumber.js';
import { ethDefaultInfo, wethDefaultInfo } from '../../../constants/tokenInfo';
import { UniswapCacheService } from '../../helpers/uniswapCache.service';
import IORedis from 'ioredis';
import {
  checkTokenArrPriceInUSDandETHByBlockNumber,
  checkTokenArrPriceInUSDandETHCurrent,
} from './uniswap.gqlRequests';

@Service()
export default class UniswapService {
  private limiter: Bottleneck;
  private clientGQ: GraphQLClient;
  private uniswapCacheService: UniswapCacheService;
  private redis: IORedis.Redis;

  constructor() {
    this.redis = new IORedis(config.bottleneckRedisURL);
    const connection = new Bottleneck.IORedisConnection({ client: this.redis });
    this.limiter = new Bottleneck({
      minTime: 25,
      id: 'uniswap',
      clearDatastore: false,
      datastore: 'ioredis',
      connection,
      Redis: IORedis,
    });

    this.clientGQ = new GraphQLClient(config.uniswap.uniswapGQLEndpointUrl);
    this.uniswapCacheService = Container.get(UniswapCacheService);
  }

  // Deprecated
  // public checkUSDTokenPriceLimiter(token: string, blockNumber: number): Promise<string> {
  //   return this.limiter.schedule<string>(() => this.checkUSDTokenPrice(token, blockNumber));
  // }

  // Deprecated
  // public checkCurrentTokenPriceInETHLimiter(token: string): Promise<string> {
  //   return this.limiter.schedule<string>(() => this.checkCurrentTokenPriceInETH(token));
  // }

  public checkTokenPriceInUSDandETHLimiter(token: string, blockNumber?: number): Promise<ITokenPriceUSDETH> {
    return this.limiter.schedule<ITokenPriceUSDETH>(() => this.checkTokenPriceInUSDandETH(token, blockNumber));
  }

  public async checkTokenArrPriceInUSDandETHLimiter(
    argumentsData: ICheckTokenArrPriceInUSDandETHArguments,
  ): Promise<IArrTokenPriceCheckResult> {
    if (await this.uniswapCacheService.isExist(JSON.stringify(argumentsData))) {
      return this.uniswapCacheService.getData<IArrTokenPriceCheckResult>(JSON.stringify(argumentsData));
    }

    return this.limiter.schedule<IArrTokenPriceCheckResult>(() => this.checkTokenArrPriceInUSDandETH(argumentsData));
  }

  // Deprecated (not Used)
  // public checkCurrentDateTokenArrPriceInUSDandETHLimiter(tokens: string[]): Promise<IArrTokenPriceCheckResult> {
  //   return this.limiter.schedule<IArrTokenPriceCheckResult>(() =>
  //     this.checkCurrentDateTokenArrPriceInUSDandETH(tokens),
  //   );
  // }

  // Deprecated (not Used)
  // public checkCurrentETHPriceInUSDLimiter(): Promise<string> {
  //   return this.limiter.schedule<string>(() => this.checkCurrentETHPriceInUSD());
  // }

  public getUniswapTransactionByIdLimiter(transactionId: string, blockNumber: number): Promise<IUniswapRawTransaction> {
    return this.limiter.schedule<IUniswapRawTransaction>(() =>
      this.getUniswapTransactionById(transactionId, blockNumber),
    );
  }

  private async checkCurrentETHPriceInUSD(): Promise<string> {
    try {
      const PAIR_SEARCH = gql`
        query pairs() {
          ethPrice: bundles() {
            ethPrice
          }
        }
      `;

      const result = await this.clientGQ.request(PAIR_SEARCH);

      if (result?.ethPrice[0]?.ethPrice) {
        return result?.ethPrice[0]?.ethPrice;
      }

      return '0';
    } catch (e) {
      throw e;
    }
  }

  private async checkCurrentTokenPriceInETH(token: string): Promise<string> {
    try {
      const PAIR_SEARCH = gql`
        query pairs($token: Bytes!, $tokenWETH: Bytes!) {
          weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }) {
            id
            token1Price
          }
          weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }) {
            id
            token0Price
          }
        }
      `;

      const variables = {
        token: token.toLowerCase(),
        tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      };

      const result = await this.clientGQ.request(PAIR_SEARCH, variables);

      if (result?.weth0[0]?.token1Price) {
        return result?.weth0[0]?.token1Price;
      }

      if (result?.weth1[0]?.token0Price) {
        return result?.weth1[0]?.token0Price;
      }

      return '0';
    } catch (e) {
      throw e;
    }
  }

  private async checkUSDTokenPrice(token: string, blockNumber: number): Promise<string> {
    try {
      const PAIR_SEARCH = gql`
        query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {
          usdc0: pairs(
            where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token1Price
          }
          usdc1: pairs(
            where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token0Price
          }
          weth0: pairs(
            where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token1Price
          }
          weth1: pairs(
            where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }
            block: { number: $blockNumber }
          ) {
            id
            token0Price
          }
          ethPrice: bundles(block: { number: $blockNumber }) {
            ethPrice
          }
        }
      `;

      const variables = {
        token: token.toLowerCase(),
        tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        blockNumber: blockNumber,
      };

      // Check if Token for Check is USDC
      if (variables.token.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
        return '1';
      }

      const result = await this.clientGQ.request(PAIR_SEARCH, variables);

      if (result?.usdc0[0]?.token1Price) {
        return result?.usdc0[0]?.token1Price;
      }

      if (result?.usdc1[0]?.token0Price) {
        return result?.usdc1[0]?.token0Price;
      }

      if (result?.weth0[0]?.token1Price) {
        return new BigNumber(result?.weth0[0]?.token1Price)
          .multipliedBy(new BigNumber(result?.ethPrice[0]?.ethPrice))
          .toString();
      }

      if (result?.weth1[0]?.token0Price) {
        return new BigNumber(result?.weth1[0]?.token0Price)
          .multipliedBy(new BigNumber(result?.ethPrice[0]?.ethPrice))
          .toString();
      }

      // console.warn('Wrong Uni token Price', variables.token, variables.blockNumber);

      return '0';
    } catch (e) {
      throw e;
    }
  }

  private async checkCurrentDateTokenArrPriceInUSDandETH(tokens: string[]): Promise<IArrTokenPriceCheckResult> {
    let count = 0;
    const maxTries = 10;
    while (true) {
      try {
        const PAIR_SEARCH = gql`
          query pairs($tokens: [Bytes!], $tokenUSDC: Bytes!, $tokenWETH: Bytes!) {
            usdc0: pairs(
              where: { token0_in: $tokens, token1: $tokenUSDC, reserveUSD_gt: 10000 }
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
            ) {
              id
              token0Price
              token1 {
                id
                symbol
              }
            }
            ethPrice: bundles() {
              ethPrice
            }
          }
        `;

        const variables = {
          tokens: tokens.map((item) => item.toLowerCase()),
          tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        };

        const result: ICheckTokenArrPriceInUSDandETHResponse = await this.clientGQ.request(PAIR_SEARCH, variables);

        return tokens.reduce((accum, value, index) => {
          const token = value.toLowerCase();
          accum[value] = this.tokenPriceSwitcher(token, result);
          return accum;
        }, {});
        break;
      } catch (e) {
        console.log('retry');
        if (++count === maxTries) throw e;
      }
    }
  }

  private async checkTokenArrPriceInUSDandETH(
    argumentsData: ICheckTokenArrPriceInUSDandETHArguments,
  ): Promise<IArrTokenPriceCheckResult> {
    let count = 0;
    const maxTries = 10;
    while (true) {
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

        const variables = {
          tokens: argumentsData.tokens.map((item) => item.toLowerCase()),
          tokenUSDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          tokenWETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          // UNISWAP NO DATA BEFORE 10009000 BLOCK
          blockNumber: argumentsData.blockNumber > 10009000 ? argumentsData.blockNumber : 10009000,
        };

        const result: ICheckTokenArrPriceInUSDandETHResponse = await this.clientGQ.request(PAIR_SEARCH, variables);

        const dataResult = argumentsData.tokens.reduce((accum, value, index) => {
          const token = value.toLowerCase();
          accum[value] = this.tokenPriceSwitcher(token, result);
          return accum;
        }, {});

        // Write data to cache
        if (dataResult && !(await this.uniswapCacheService.isExist(JSON.stringify(argumentsData)))) {
          await this.uniswapCacheService.setData<IArrTokenPriceCheckResult>(JSON.stringify(argumentsData), dataResult);
        }

        return dataResult;
        break;
      } catch (e) {
        console.log('retry');
        if (++count === maxTries) throw e;
      }
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
          blockNumber: blockNumber,
        };

        // // Check if Token for Check is USDC
        // if (variables.token.toLowerCase() === '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48') {
        //   return '1';
        // }

        const result = await this.clientGQ.request(PAIR_SEARCH, variables);

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
        console.log('retry');
        if (++count === maxTries) throw e;
      }
    }
  }

  private async getUniswapTransactionById(transactionId: string, blockNumber: number): Promise<IUniswapRawTransaction> {
    try {
      const query = gql`
      {
        swaps(where: { transaction: "${transactionId}" }) {
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
        ethPrice: bundles(block: { number: ${blockNumber} }) {
          ethPrice
        }
      }
    `;
      return this.clientGQ.request<any>(query).then<IUniswapRawTransaction>((res) => {
        if (!res.swaps[0]) {
          return undefined;
        }
        res.swaps[0]['amountETH'] = new BigNumber(res.swaps[0].amountUSD)
          .dividedBy(res?.ethPrice[0]?.ethPrice)
          .toString();

        res.swaps[0]['ethPrice'] = res.ethPrice[0].ethPrice;
        return res.swaps[0];
      });
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
