export default {
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  uniswap: {
    uniswapRouterAddress: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    uniswapGQLEndpointUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  },
};
