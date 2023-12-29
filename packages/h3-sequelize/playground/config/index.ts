import { fileURLToPath } from 'node:url';
import { read } from 'rc9';
import { type ConnectionOptions } from '@wxjs/sequelize';
import { defu } from 'defu';

interface Config {
  database: ConnectionOptions & { models: { dir: string } };
}

export const config: Config = defu(
  read({
    dir: fileURLToPath(new URL('..', import.meta.url))
  }),
  {
    database: {
      storage: './testdb.sqlite3',
      dialect: 'sqlite',
      verbose: false,
      models: {
        dir: './datbase/models'
      }
    }
  }
) as any;
