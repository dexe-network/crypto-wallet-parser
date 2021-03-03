import { stringify } from 'qs';

interface KeyValueObject {
  [key: string]: any;
}

export function toQueryString(obj: KeyValueObject, addQueryPrefix = true): string {
  return stringify(obj, { addQueryPrefix: addQueryPrefix, strictNullHandling: true });
}
