import type { ConnectionOptions } from '@windx-foobar/sequelize';
import { defineCommand, type ArgsDef } from 'citty';
import { resolve } from 'pathe';
import { defu } from 'defu';
import { execa, type Options } from 'execa';
import { read } from 'rc9';
import { isString } from '@windx-foobar/shared';
import { createError } from '../errors';
import { findSequelizeCli } from '../_utils';

type WrappedCommandArgs = 'db:migrate' | 'db:migrate:undo:all';

export function defineWrapper<T extends WrappedCommandArgs>(name: T, description?: string) {
  const argsManager = <Record<WrappedCommandArgs, ArgsDef>>{
    'db:migrate': {
      to: {
        type: 'string',
        description: 'TBD',
        required: false
      },
      from: {
        type: 'string',
        description: 'TBD',
        required: false
      }
    },
    'db:migrate:undo:all': {
      to: {
        type: 'string',
        description: 'TBD',
        required: false
      }
    }
  };

  if (!argsManager[name]) {
    throw createError({
      name: 'SequelizeCliRuntimeError',
      message: `${name} executor not found`
    });
  }

  return defineCommand({
    meta: {
      name,
      description
    },
    args: {
      config: {
        type: 'positional',
        required: false,
        default: '.',
        description: 'Path to config file (.conf)',
        valueHint: './.conf, ./playground/.conf'
      },
      configKey: {
        type: 'positional',
        required: false,
        default: 'sequelize',
        description: 'Path to config key options database from config object',
        valueHint: 'database,sequelize'
      },
      ...argsManager[name]
    },
    async run({ args }) {
      const configPath = resolve((process.env.CONFIG || args.config || '.') as string);
      const configKey = (process.env.CONFIGKEY || args.configKey || '.') as string;

      const config = read<{
        [k: string]: ConnectionOptions &
          { models?: { dir?: string }; migrations?: { dir: string; } }
      }>(configPath);

      let connectionString: string;

      const sequelizeConfig = defu(config[configKey] || {}, {
        models: {
          dir: './models'
        },
        migrations: {
          dir: './migrations'
        }
      });

      if (sequelizeConfig.dialect === 'sqlite') {
        const { storage } = sequelizeConfig;
        connectionString = `sqlite:${resolve(storage)}`;
      } else {
        const { dialect, username, password, host, port, database } = sequelizeConfig;
        connectionString = `${dialect}://${username}:${password}@${host}:${port}/${database}`;
      }

      const execaOptions: Options = {
        stdio: 'inherit',
        extendEnv: true,
        env: {
          NODE_OPTIONS: '--require jiti/register'
        }
      };

      const cliBinPath = findSequelizeCli();
      if (!isString(cliBinPath)) {
        throw createError({
          name: 'SequelizeCliRuntimeError',
          message: 'sequelize-cli binary execute not found in node_modules'
        });
      }

      try {
        await execa(
          cliBinPath,
          [
            name,
            `--migrations-path=${resolve(sequelizeConfig.migrations.dir)}`,
            `--models-path=${resolve(sequelizeConfig.models.dir)}`,
            `--url=${connectionString}`,
            `--env=development`,
            (args.to || null) && `--to=${args.to}`,
            (args.from || null) && `--from=${args.from}`
          ].filter(Boolean) as string[],
          execaOptions
        );
      } catch { /* empty */ }
    }
  });
}
