import jiti from "file:///home/windx/Projects/nuxt-modules/wxjs/node_modules/.pnpm/jiti@1.21.0/node_modules/jiti/lib/index.js";

/** @type {import("/home/windx/Projects/nuxt-modules/wxjs/packages/sequelize/src/index")} */
const _module = jiti(null, {
  "esmResolve": true,
  "interopDefault": true,
  "alias": {
    "@wxjs/sequelize": "/home/windx/Projects/nuxt-modules/wxjs/packages/sequelize"
  }
})("/home/windx/Projects/nuxt-modules/wxjs/packages/sequelize/src/index.ts");

export const defineSequelizeConnection = _module.defineSequelizeConnection;
export const scanModelsFolder = _module.scanModelsFolder;
export const defineModels = _module.defineModels;
export const defineModel = _module.defineModel;
export const isDefineModel = _module.isDefineModel;
export const useModel = _module.useModel;