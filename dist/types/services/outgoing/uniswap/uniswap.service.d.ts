import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { IArrTokenPriceCheckResult, ICheckTokenArrPriceInUSDandETHArguments, ITokenPriceUSDETH, IUniswapRawTransaction } from '../../../interfaces/uniswap.interfaces';
import { IParserClientConfig } from '../../../interfaces';
import { BehaviorSubject } from 'rxjs';
export declare abstract class UniswapServiceBase {
    protected abstract limiter: Bottleneck;
    protected abstract clientGQ: GraphQLClient;
    protected abstract config: IParserClientConfig;
    requestCounter: BehaviorSubject<number>;
    checkTokenPriceInUSDandETHLimiter(token: string, blockNumber?: number): Promise<ITokenPriceUSDETH>;
    checkTokenArrPriceInUSDandETHLimiter(argumentsData: ICheckTokenArrPriceInUSDandETHArguments): Promise<IArrTokenPriceCheckResult>;
    getUniswapTransactionByIdLimiter(transactionId: string, blockNumber: number): Promise<IUniswapRawTransaction>;
    protected checkTokenArrPriceInUSDandETH(argumentsData: ICheckTokenArrPriceInUSDandETHArguments): Promise<IArrTokenPriceCheckResult>;
    private checkTokenPriceInUSDandETH;
    private getUniswapTransactionById;
    private tokenPriceSwitcher;
}
