import { gql } from 'graphql-request';

export const checkTokenArrPriceInUSDandETHByBlockNumber = gql`
  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!, $blockNumber: Int!) {
    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {
      id
      token1Price
    }
    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {
      id
      token0Price
    }
    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {
      id
      token1Price
    }
    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }, block: { number: $blockNumber }) {
      id
      token0Price
    }
    ethPrice: bundles(block: { number: $blockNumber }) {
      ethPrice
    }
  }
`;

export const checkTokenArrPriceInUSDandETHCurrent = gql`
  query pairs($token: Bytes!, $tokenUSDC: Bytes!, $tokenWETH: Bytes!) {
    usdc0: pairs(where: { token0: $token, token1: $tokenUSDC, reserveUSD_gt: 10000 }) {
      id
      token1Price
    }
    usdc1: pairs(where: { token1: $token, token0: $tokenUSDC, reserveUSD_gt: 10000 }) {
      id
      token0Price
    }
    weth0: pairs(where: { token0: $token, token1: $tokenWETH, reserveUSD_gt: 10000 }) {
      id
      token1Price
    }
    weth1: pairs(where: { token1: $token, token0: $tokenWETH, reserveUSD_gt: 10000 }) {
      id
      token0Price
    }
    ethPrice: bundles(where: { id: 1 }) {
      ethPrice
    }
  }
`;
