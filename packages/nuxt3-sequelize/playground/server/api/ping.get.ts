import { useSequelize } from '#wxjs/sequelize';
import { QueryTypes } from '#wxjs/sequelize/extra';

export default defineEventHandler(async (event) => {
  const sequelize = useSequelize(event);

  const nuxtPackage = await import('nuxt/package.json');
  const nuxtSequelizePackage = await import('../../../package.json');
  const nitroSequelizePackage = await import('@windx-foobar/nitro-sequelize/package.json');
  const h3SequelizePackage = await import('@windx-foobar/h3-sequelize/package.json');
  const sequelizePackage = await import('@windx-foobar/sequelize/package.json');
  const [sqliteResult] = await sequelize.query('SELECT sqlite_version();', {
    type: QueryTypes.SELECT
  });

  return {
    message: 'pong',
    stack: {
      nuxt: nuxtPackage.version,
      '@windx-foobar/sequelize': sequelizePackage.version,
      '@windx-foobar/h3-sequelize': h3SequelizePackage.version,
      '@windx-foobar/nitro-sequelize': nitroSequelizePackage.version,
      '@windx-foobar/nuxt3-sequelize': nuxtSequelizePackage.version,
      'sqlite': sqliteResult['sqlite_version()']
    }
  };
});
