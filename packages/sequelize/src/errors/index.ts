import * as SequelizeErrors from './sequelize';
import * as RuntimeErrors from './runtime';

interface CreateErrorOptions {
  name: keyof typeof SequelizeErrors | keyof typeof RuntimeErrors;
  message?: string;
  cause?: Error;
}

export function createError(options: CreateErrorOptions) {
  let _err;

  switch (true) {
    case Object.keys(SequelizeErrors).includes(options.name):
      _err = SequelizeErrors[options.name as keyof typeof SequelizeErrors];
      break;

    case Object.keys(RuntimeErrors).includes(options.name):
      _err = RuntimeErrors[options.name as keyof typeof RuntimeErrors];
      break;

    case true:
    default:
      _err = Error;
  }

  const err = new _err(options.message);
  if (options.cause) {
    err.cause = options.cause;
  }

  return err;
}

export * from './sequelize';
export * from './runtime';
