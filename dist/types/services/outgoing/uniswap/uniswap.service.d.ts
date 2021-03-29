import Bottleneck from 'bottleneck';
import { GraphQLClient } from 'graphql-request';
import { IArrTokenPriceCheckResult, ICheckTokenArrPriceInUSDandETHArguments, IGetUniswapTransactionByIdArguments, ITokenPriceUSDETH, IUniswapRawTransaction } from '../../../interfaces/uniswap.interfaces';
import { IParserClientConfig } from '../../../interfaces';
import { BehaviorSubject } from 'rxjs';
import { UniswapCacheService } from '../../helpers/uniswapCache.service';
import { UniswapPrebuildCacheService } from '../../helpers/uniswapPrebuildCache.service';
export declare abstract class UniswapServiceBase {
    protected abstract limiter: Bottleneck;
    protected abstract clientGQ: GraphQLClient;
    protected abstract config: IParserClientConfig;
    protected abstract uniswapCacheService: UniswapCacheService | UniswapPrebuildCacheService;
    requestCounter: BehaviorSubject<number>;
    checkTokenPriceInUSDandETHLimiter(token: string, blockNumber?: number): Promise<ITokenPriceUSDETH>;
    checkTokenArrPriceInUSDandETHLimiter(argumentsData: ICheckTokenArrPriceInUSDandETHArguments): Promise<IArrTokenPriceCheckResult>;
    getUniswapTransactionByIdLimiter(argumentsData: IGetUniswapTransactionByIdArguments): Promise<IUniswapRawTransaction>;
    protected checkTokenArrPriceInUSDandETH(argumentsData: ICheckTokenArrPriceInUSDandETHArguments): Promise<IArrTokenPriceCheckResult>;
    private checkTokenPriceInUSDandETH;
    private getUniswapTransactionById;
    private tokenPriceSwitcher;
}
