#!/usr/bin/node

import { runMain } from 'citty';
import { defineWrapper } from './commands/wrapper';
import pkg from '../package.json';

runMain({
  meta: {
    name: 'wxjs-sequelize-cli',
    version: pkg.version,
    description: 'Wrapper citty to use native sequelize-cli'
  },
  subCommands: {
    'db:migrate': defineWrapper('db:migrate', 'Run pending migrations'),
    'db:migrate:undo:all': defineWrapper('db:migrate:undo:all', 'Rollback all migrations')
  }
}).then(() => {});

export {};

