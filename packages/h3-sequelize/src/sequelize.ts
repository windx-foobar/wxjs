import { type App, eventHandler, type H3Event, isEvent } from 'h3';
import { type ConnectionOptions, defineSequelizeConnection, useModel as _useModel, defineModels as _defineModels, useTransaction as _useTransaction, scanModelsFolder, ModelDefinition, type ModelsMap } from '@wxjs/sequelize';
import { type Sequelize } from '@wxjs/sequelize/extra';
import { isUndefined } from '@wxjs/shared';
import { createError } from './errors';
import { logger } from './_logger';

export async function defineSequelize(app: App, options: ConnectionOptions) {
  const { verbose } = options;
  const _verbose = isUndefined(verbose) ? false : verbose;

  const debug = (...args: any[]) => _verbose && logger.log(args[0], ...args.slice(1));

  debug('Staring inject sequelize in event.context');

  const sequelize = await defineSequelizeConnection(options);

  app.stack.unshift({
    route: '*',
    handler: eventHandler((event) => {
      event.context.sequelize = sequelize;
    })
  });

  debug('Sequelize is injected');

  return sequelize;
}

export function useSequelize(event: H3Event): Sequelize {
  if (!isEvent(event)) {
    throw createError({
      name: 'EventIsNotH3Event',
      message: 'useSequelize->event is not H3Event. Please pass correct event'
    });
  }

  if (!event.context.sequelize) {
    throw createError({
      name: 'H3EventContextSequelizeNotFound',
      message: 'useSequelize->event[context][sequelize] not defined. Please use defineSequelize at first'
    });
  }

  return event.context.sequelize;
}

export function useModel<T extends keyof Omit<ModelsMap, 'Base'>>(event: H3Event, modelName: T): ModelsMap[T] {
  const sequelize = useSequelize(event);
  return _useModel(sequelize, modelName as any);
}

export async function defineModels(sequelize: Sequelize, modelsDir: string) {
  const modelPaths = await scanModelsFolder(modelsDir);
  const modelsDefs = await Promise.all(
    modelPaths.map((item) => {
      return import(item.fullPath).then((m) => m.default as ModelDefinition);
    })
  );

  return _defineModels(sequelize, modelsDefs);
}

export function useTransaction(
  event: H3Event,
  fn: Parameters<typeof _useTransaction>[1]
): ReturnType<typeof _useTransaction> {
  const sequelize = useSequelize(event);
  return _useTransaction(sequelize, fn);
}

export { defineModel, isDefineModel } from '@wxjs/sequelize';
