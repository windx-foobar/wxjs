import { describe, it, expect } from 'vitest';

import { defineSequelizeConnection } from '../../src';
import { ConnectionError } from '../../src/errors';

import { useTmpStorage } from '../mocks/storage';

const storage = useTmpStorage();

describe('defineSequelizeConnection', () => {
  it('check validation with empty options', async () => {
    // @ts-ignore
    await expect(() => defineSequelizeConnection({}))
      .rejects
      .toThrowError(new ConnectionError('defineSequelizeConnection->options[dialect] is required'));
  });

  it('[sqlite] check validation with only dialect', async () => {
    // @ts-ignore
    await expect(() => defineSequelizeConnection({ dialect: 'sqlite' }))
      .rejects
      .toThrowError(new ConnectionError('defineSequelizeConnection->options[storage] is required'));
  });

  it('[no sqlite] check validation with only dialect', async () => {
    // @ts-ignore
    await expect(() => defineSequelizeConnection({ dialect: 'postgres' }))
      .rejects
      .toThrowError(new ConnectionError(
        [
          '',
          'defineSequelizeConnection->options[host] is required',
          'defineSequelizeConnection->options[port] is required'
        ].join('\n')
      ));
  });
});
