import type { ModelDefinition, ModelsMap, ModelDefinitionResult } from './types';
import { type Sequelize, DataTypes } from 'sequelize';
import { globby } from 'globby';
import { parse } from 'pathe';
import { hash } from 'ohash';
import { isArray } from '@wxjs/shared';
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
  const modelsNeedAssociate: Required<ModelDefinitionResult>[] = [];

  if (!isArray(modelsDefs)) {
    throw createError({
      name: 'SequelizeRuntimeError',
      message: 'defineModels->modelsDefs is not array. Waiting definitions array'
    });
  }

  for (const modelDef of modelsDefs.filter((modelDef) => isDefineModel(modelDef))) {
    let returnValue = modelDef(sequelize, DataTypes);
    let returnLiteral = returnValue?.toString();

    if (returnLiteral === '[object Promise]') {
      returnValue = await returnValue;
      returnLiteral = returnValue?.toString();
    }

    if (returnValue) {
      // @ts-ignore
      if (returnValue.association) {
        // @ts-ignore
        modelsNeedAssociate.push(returnValue);
      }
    }
  }

  for (const modelAssociateFn of modelsNeedAssociate) {
    // @ts-ignore
    const returnValue = modelAssociateFn.association(sequelize.models as ModelsMap);
    const returnLiteral = returnValue?.toString();

    if (returnLiteral === '[object Promise]') {
      await returnValue;
    }
  }
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
