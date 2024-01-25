import { type Router, createApp, toNodeListener } from 'h3';
import { resolve } from 'node:path';
import { listen } from 'listhen';
import { getPort } from 'get-port-please';
import { config } from './config';
import { defineSequelize, defineModels } from '../src';

const app = createApp();

async function main() {
  const modules: Promise<{ default: Router }>[] = [
    import('./api/ping'),
    import('./api/certificates'),
    import('./api/posts'),
    import('./api/services'),
    import('./api/users')
  ];

  const sequelize = await defineSequelize(app, config.database);
  await defineModels(sequelize, resolve(config.database.models.dir));

  await Promise.all(
    modules.map(m => m.then(m => app.use(m.default)))
  );

  const port = await getPort();
  await listen(toNodeListener(app), { port });
}

main().then(() => {});
