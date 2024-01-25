import { isString } from './string';

export const isNumber = (maybeUndef: unknown): maybeUndef is number => {
  return Object.prototype.toString.call(maybeUndef) === '[object Number]';
};

export const isNumeric = (maybeUndef: unknown): maybeUndef is number | string => {
  if (isNumber(maybeUndef)) return true;

  return isString(maybeUndef) && !isNaN(+maybeUndef);
};
