import { IParserApiConfig } from '../../interfaces';
export declare class UniswapCacheService {
    private redis;
    constructor(config: IParserApiConfig);
    getData<T>(keyValue: string): Promise<T>;
    setData<T>(keyValue: string, data: T): Promise<void>;
    isExist(keyValue: string): Promise<boolean>;
    private getObjectFromRedis;
    private setObjectToRedis;
}
