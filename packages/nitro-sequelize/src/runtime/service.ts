import { type NitroApp } from 'nitropack';
import { defineModels as _defineModels, type ModelDefinition } from '@wxjs/sequelize';
import { type Sequelize } from '@wxjs/sequelize/extra';
import { defineSequelize as _defineSequelize } from '@wxjs/h3-sequelize';

export function defineSequelize(nitroApp: NitroApp) {
  const { sequelize: sequelizeConfig } = useRuntimeConfig();
  return _defineSequelize(nitroApp.h3App, sequelizeConfig);
}

export async function defineModels(sequelize: Sequelize) {
  // @ts-ignore
  const modelsDefs = ((await import('#internal/sequelize/models'))?.models || []) as ModelDefinition[];
  return await _defineModels(sequelize, modelsDefs);
}

export { useSequelize, defineModel, useModel, isDefineModel } from '@wxjs/h3-sequelize';
