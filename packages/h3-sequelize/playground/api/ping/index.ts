import { createRouter, eventHandler } from 'h3';
import { QueryTypes } from '@windx-foobar/sequelize/extra';
import { useSequelize } from '../../../src';

const router = createRouter();

router.get('/api/ping', eventHandler(async (event) => {
  const sequelize = useSequelize(event);

  // @ts-ignore
  const h3Package = await import('h3/package.json');
  const h3SequelizePackage = await import('../../../package.json');
  const wxjsSequelizePackage = await import('@windx-foobar/sequelize/package.json');
  const [sqliteResult] = await sequelize.query('SELECT sqlite_version();', {
    type: QueryTypes.SELECT
  });

  return {
    message: 'pong',
    stack: {
      h3: h3Package.version,
      '@windx-foobar/sequelize': wxjsSequelizePackage.version,
      '@windx-foobar/h3-sequelize': h3SequelizePackage.version,
      'sqlite': sqliteResult['sqlite_version()']
    }
  };
}));

export default router;
