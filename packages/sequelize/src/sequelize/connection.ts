import { Sequelize } from 'sequelize';
import { isBoolean, isUndefined } from '@wxjs/shared';
import { ConnectionOptions } from './types';
import { checkConnectionOptions } from './_utils';
import { createError } from '../errors';
import { logger } from '../_logger';

export async function defineSequelizeConnection(options: ConnectionOptions): Promise<Sequelize> {
  let sequelize: Sequelize;
  checkConnectionOptions(options);

  const { logging, verbose, ...passingOptions } = options;
  const _verbose = isUndefined(verbose) ? false : verbose;

  let _logging;
  if (isBoolean(logging) || isUndefined(logging)) {
    _logging = logging;
  } else {
    _logging = (sql: string) => logging(sql);
  }

  try {
    sequelize = new Sequelize({
      ...passingOptions as object,
      logging: _logging
    });

    if (_verbose) {
      logger.log('Env is development. Check connection...');
      await sequelize.sync({ logging: () => {} });
      logger.log('Connection is done.');
    }
  } catch (error: any) {
    throw createError({
      name: 'ConnectionError',
      message: 'Something wrong connection',
      cause: error
    });
  }

  return sequelize;
}
