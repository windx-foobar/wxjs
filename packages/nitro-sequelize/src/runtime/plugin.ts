import { defineNitroPlugin } from '#imports';

import { defineSequelize, defineModels } from './service';

export default defineNitroPlugin(async (nitroApp) => {
  const sequelize = await defineSequelize(nitroApp);
  await defineModels(sequelize);
});
