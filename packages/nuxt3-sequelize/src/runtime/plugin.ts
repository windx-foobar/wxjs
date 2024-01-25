import { defineSequelize, defineModels } from '#wxjs/sequelize';

export default defineNitroPlugin(async (nitroApp) => {
  const sequelize = await defineSequelize(nitroApp);
  await defineModels(sequelize);
});
