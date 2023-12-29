import { fileURLToPath } from 'node:url';
import { type Router, createApp, toNodeListener } from 'h3';
import { listen } from 'listhen';
import { getPort } from 'get-port-please';
import { omit } from '@wxjs/shared';
import { config } from './config';
import { defineSequelize, defineModels } from '../src';

const app = createApp();

async function main() {
  const modules: Promise<{ default: Router }>[] = [
    import('./api/ping'),
    import('./api/users')
  ];

  let options: typeof config.database;

  if (config.database.dialect === 'sqlite' && config.database.storage) {
    options = {
      ...config.database,
      storage: fileURLToPath(new URL(config.database.storage as string, import.meta.url))
    };
  } else {
    options = config.database;
  }

  const sequelize = await defineSequelize(app, options);
  await defineModels(sequelize, fileURLToPath(new URL(options.models.dir, import.meta.url)));

  await Promise.all(
    modules.map(m => m.then(m => app.use(m.default)))
  );

  const port = await getPort();
  await listen(toNodeListener(app), { port });
}

main().then(() => {});
