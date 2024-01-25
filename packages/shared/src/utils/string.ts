export const isString = (maybeUndef: unknown): maybeUndef is string => {
  return Object.prototype.toString.call(maybeUndef) === '[object String]';
};
