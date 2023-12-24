import { fileURLToPath } from 'node:url';
import { type Router, createApp, toNodeListener, eventHandler } from 'h3';
import { listen } from 'listhen';
import { getPort } from 'get-port-please';
import { defineSequelizeConnection } from '@wxjs/sequelize';

const app = createApp();

async function main() {
  const modules: Promise<{ default: Router }>[] = [
    import('./api/ping')
  ];

  const sequelize = await defineSequelizeConnection({
    dialect: 'sqlite',
    storage: fileURLToPath(new URL('./testdb.sqlite3', import.meta.url)),
    verbose: true
  });
  app.stack.push({
    route: '*',
    handler: eventHandler((event) => {
      event.context.sequelize = sequelize;
    })
  });

  await Promise.all(
    modules.map(m => m.then(m => app.use(m.default)))
  );

  const port = await getPort();
  await listen(toNodeListener(app), { port });
}

main().then(() => {});
