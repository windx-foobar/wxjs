import { useSequelize } from '#wxjs/sequelize';
import { QueryTypes } from '#wxjs/sequelize/extra';

export default defineEventHandler(async (event) => {
  const sequelize = useSequelize(event);

  const nitropackPackage = await import('nitropack/package.json');
  const nitroSequelizePackage = await import('../../package.json');
  const h3SequelizePackage = await import('@wxjs/h3-sequelize/package.json');
  const wxjsSequelizePackage = await import('@wxjs/sequelize/package.json');
  const [sqliteResult] = await sequelize.query('SELECT sqlite_version();', {
    type: QueryTypes.SELECT
  });

  return {
    message: 'pong',
    stack: {
      nitropack: nitropackPackage.version,
      '@wxjs/sequelize': wxjsSequelizePackage.version,
      '@wxjs/h3-sequelize': h3SequelizePackage.version,
      '@wxjs/nitro-sequelize': nitroSequelizePackage.version,
      'sqlite': sqliteResult['sqlite_version()']
    }
  };
});
