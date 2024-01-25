import type { ConnectionOptions } from './types';
import { createError } from '../errors';

export function checkConnectionOptions(options: Partial<ConnectionOptions>) {
  if (!options.dialect)  {
    throw createError({
      name: 'ConnectionError',
      message: 'defineSequelizeConnection->options[dialect] is required'
    });
  }

  if (options.dialect === 'sqlite' && (!options.storage)) {
    throw createError({
      name: 'ConnectionError',
      message: 'defineSequelizeConnection->options[storage] is required'
    });
  }

  if (options.dialect !== 'sqlite' && (!options.host || !options.port)) {
    throw createError({
      name: 'ConnectionError',
      message: [
        '',
        'defineSequelizeConnection->options[host] is required',
        'defineSequelizeConnection->options[port] is required'
      ].join('\n')
    });
  }
}
