export declare class UniswapPrebuildCacheService {
    private cache;
    getData<T>(keyValue: string): Promise<T>;
    setData<T>(keyValue: string, data: T): Promise<void>;
    isExist(keyValue: string): Promise<boolean>;
    private getObjectFromCache;
    private setObjectToCache;
}
