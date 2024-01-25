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
    case Object.keys(SequelizeErrors).indexOf(options.name) !== -1:
      _err = SequelizeErrors[options.name];
      break;

    case Object.keys(RuntimeErrors).indexOf(options.name) !== -1:
      _err = RuntimeErrors[options.name];
      break;
  }

  const err = new _err(options.message);
  if (options.cause) {
    err.cause = options.cause;
  }

  return err;
}

export * from './sequelize';
export * from './runtime';
