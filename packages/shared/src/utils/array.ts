import { isString } from './string';
import { isPlainObject } from './object';

export const isArray = <T extends unknown[] = unknown[]>(maybeArr: unknown): maybeArr is T => {
  return Array.isArray(maybeArr);
};

export const isArrayString = (maybeArr: unknown): maybeArr is string[] => {
  if (!isArray(maybeArr)) return false;
  return maybeArr.every(isString);
};

export const isArrayPlainObject = <T extends Record<string, any> = Record<string, any>>(
  maybeArr: unknown
): maybeArr is T => {
  if (!isArray(maybeArr)) return false;
  return maybeArr.every(isPlainObject);
};
