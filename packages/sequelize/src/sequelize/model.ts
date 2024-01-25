import type { ModelDefinition, ModelsMap, ModelDefinitionResult } from './types';
import { type Sequelize, DataTypes } from 'sequelize';
import { globby } from 'globby';
import { parse } from 'pathe';
import { hash } from 'ohash';
import { isArray } from '@windx-foobar/shared';
import { createError } from '../errors';

interface ModelFolderItem {
  filename: string;
  fullPath: string;
  fullPathWithoutExt: string;
  path: string;
  modelName: string;
  fullPathHash: string;
}

export async function scanModelsFolder(modelsDir: string): Promise<ModelFolderItem[]> {
  const paths = await globby(`${modelsDir}/**.{js,ts,mjs}`);

  return paths.map((pathItem) => {
    const parsedPath = parse(pathItem);

    return {
      fullPath: pathItem,
      fullPathWithoutExt: pathItem.slice(0, pathItem.length - parsedPath.ext.length),
      path: parsedPath.dir,
      modelName: parsedPath.name.slice(0, 1).toUpperCase() + parsedPath.name.slice(1),
      filename: parsedPath.base,
      fullPathHash: hash(pathItem)
    };
  });
}

export async function defineModels(sequelize: Sequelize, modelsDefs: ModelDefinition[]): Promise<void> {
  const modelsNeedAssociate: NonNullable<ModelDefinitionResult['association']>[] = [];

  if (!isArray(modelsDefs)) {
    throw createError({
      name: 'SequelizeRuntimeError',
      message: 'defineModels->modelsDefs is not array. Waiting definitions array'
    });
  }

  await Promise.all(
    modelsDefs.filter((modelDef) => isDefineModel(modelDef)).map(async (modelDef) => {
      const returnValue = await modelDef(sequelize, DataTypes);

      if (returnValue && returnValue.association) {
        modelsNeedAssociate.push(returnValue.association);
      }
    })
  );

  await Promise.all(
    modelsNeedAssociate.map(async (assocExp) => {
      await assocExp(sequelize.models as any);
    })
  );
}

export function defineModel(def: ModelDefinition) {
  def.__model_def__ = true;
  return def;
}

export function isDefineModel(def: any): def is ModelDefinition {
  try {
    return '__model_def__' in def;
  } catch (error) {
    return false;
  }
}

export function useModel<T extends keyof ModelsMap = 'Base'>(sequelize: Sequelize, modelName: T): ModelsMap[T] {
  const model = sequelize.model(modelName);

  if (!model) {
    throw createError({
      name: 'ModelNotFoundError',
      message: `${modelName} not found in sequelize.models`
    });
  }

  if (!sequelize.isDefined(modelName)) {
    throw createError({
      name: 'ModelNotDefinedError',
      message: `${modelName} not defined in sequelize context`
    });
  }

  return model as ModelsMap[T];
}
