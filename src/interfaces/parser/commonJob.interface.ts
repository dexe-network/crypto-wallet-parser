export interface ISourceInitData {
  correctWallet: string;
  lastCheckBlockNumber: number;
  startCheckBlockNumber: number;
}

export interface ICalculateStatisticJobData {
  correctWallet: string;
  blockNumber: {
    wallet: {
      lastCheckBlockNumber: number;
      startCheckBlockNumber: number;
    };
    w2w: {
      lastCheckBlockNumber: number;
      startCheckBlockNumber: number;
    };
  };
}
