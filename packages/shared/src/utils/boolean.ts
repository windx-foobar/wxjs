export const isBoolean = (maybeUndef: unknown): maybeUndef is boolean => {
  return Object.prototype.toString.call(maybeUndef) === '[object Boolean]';
};

export const isTruthy = (maybeUndef: unknown): maybeUndef is true => {
  if (isBoolean(maybeUndef)) return maybeUndef;
  return !!maybeUndef;
};

export const isFalsy = (maybeUndef: unknown): maybeUndef is false => {
  return !maybeUndef;
};
