interface KeyValueObject {
    [key: string]: any;
}
export declare function toQueryString(obj: KeyValueObject, addQueryPrefix?: boolean): string;
export {};
