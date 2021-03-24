import { NETWORK_TYPE } from "../interfaces/main.interfaces"

export default {
  uniswap: {
    uniswapRouterAddress: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    uniswapGQLEndpointUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    // uniswapGQLEndpointUrl: 'https://api.bscgraph.org/subgraphs/name/cakeswap/graphql',
  },
  [NETWORK_TYPE.ETH]: {
    apiUrl: 'https://api.etherscan.io/api?module=',
  },
  [NETWORK_TYPE.BNB]: {
    apiUrl: 'https://api.bscscan.com/api?module=',
  },
  infuraUrl: 'https://mainnet.infura.io/v3',
};
