export const isObject = <T = Object>(
  maybeObj: unknown
): maybeObj is T => {
  return Object.prototype.toString.call(maybeObj) === '[object Object]';
};

export const isPlainObject = <T extends Record<string, any> = Record<string, unknown>>(
  maybeObj: unknown
): maybeObj is T => {
  if (!isObject(maybeObj)) return false;
  return Object.getPrototypeOf(maybeObj) === Object.prototype;
};

export const isNull = (maybeAny: unknown): maybeAny is null => {
  return Object.prototype.toString.call(maybeAny) === '[object Null]';
};

export const isUndefined = (maybeAny: unknown): maybeAny is undefined => {
  return Object.prototype.toString.call(maybeAny) === '[object Undefined]';
};

export const isNullOrUndefined = (maybeAny: unknown): maybeAny is undefined | null => {
  return isNull(maybeAny) || isUndefined(maybeAny);
};

export function pick<O extends Record<string, any> = Record<string, any>, K extends(keyof O)[] = (keyof O)[]>(
  obj: O,
  keys: K
): Pick<O, K[number]> {
  if (!isObject(obj)) {
    throw new Error('Passed not plain object');
  }

  return Object.keys(obj)
    .filter((key) => keys.includes(key))
    .reduce<any>(
      (acc, key) => {
        acc[key] = obj[key];

        return acc;
      },
      {} as Pick<O, K[number]>
    );
}

export function tryPick<O extends Record<string, any> = Record<string, any>, K extends(keyof O)[] = (keyof O)[]>(
  obj: O,
  keys: K
): Pick<O, K[number]> {
  try {
    return pick(obj, keys);
  } catch (error) {
    return {} as any;
  }
}

export function omit<O extends Record<string, any> = Record<string, any>, K extends(keyof O)[] = (keyof O)[]>(
  obj: O,
  keys: K
): Omit<O, K[number]> {
  if (!isObject(obj)) {
    throw new Error('Passed not plain object');
  }

  return Object.keys(obj)
    .filter((key) => !keys.includes(key))
    .reduce<any>(
      (acc, key) => {
        acc[key] = obj[key];

        return acc;
      },
      {} as Omit<O, K[number]>
    );
}

export function tryOmit<O extends Record<string, any> = Record<string, any>, K extends(keyof O)[] = (keyof O)[]>(
  obj: O,
  keys: K
): Omit<O, K[number]> {
  try {
    return omit(obj, keys);
  } catch (error) {
    return {} as any;
  }
}
