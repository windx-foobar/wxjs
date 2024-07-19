import { type NitroApp } from 'nitropack';
// @ts-ignore
import { defineModels as _defineModels, type ModelDefinition, type NitroModelsMap } from '@windx-foobar/sequelize';
import { type Sequelize } from '@windx-foobar/sequelize/extra';
import { defineSequelize as _defineSequelize, useModel as _useModel } from '@windx-foobar/h3-sequelize';
import { type H3Event } from 'h3';
// @ts-ignore
import { useRuntimeConfig } from '#imports';

export function defineSequelize(nitroApp: NitroApp) {
  const { sequelize: sequelizeConfig } = useRuntimeConfig();
  return _defineSequelize(nitroApp.h3App, sequelizeConfig);
}

export async function defineModels(sequelize: Sequelize) {
  // @ts-ignore
  const modelsDefs = ((await import('#internal/sequelize/models'))?.models || []) as ModelDefinition[];
  return await _defineModels(sequelize, modelsDefs);
}

export function useModel<T extends keyof Omit<NitroModelsMap, 'Base'>>(event: H3Event, modelName: T): NitroModelsMap[T] {
  return _useModel(event, modelName as any);
}

export { useSequelize, defineModel, isDefineModel } from '@windx-foobar/h3-sequelize';
