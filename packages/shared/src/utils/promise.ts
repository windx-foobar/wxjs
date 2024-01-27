import { type PromiseLike, type Thenable } from '../types';
import { isArray } from './array';
import { isNull } from './object';

type IsPromiseLike = {
  <T = any>(promise: Promise<T>): promise is Promise<T>;
  <T = any>(maybePromiseLike: unknown): maybePromiseLike is PromiseLike<T>;
}

type IsThenable = {
  <T = any>(promise: Promise<T>): promise is Promise<T>;
  <T = any>(maybeThenable: unknown): maybeThenable is Thenable<T>;
}

export const isPromise = <T = any>(maybePromise: unknown): maybePromise is Promise<T> => {
  return maybePromise instanceof Promise;
};

// @ts-ignore
export const isThenable: IsThenable = (param) => {
  if (isPromise(param)) return true;
  if (isArray(param) || isNull(param) || typeof param !== 'object') return false;

  return 'then' in param!;
};

// @ts-ignore
export const isPromiseLike: IsPromiseLike = (param) => {
  return isThenable(param) && 'catch' in param;
};
