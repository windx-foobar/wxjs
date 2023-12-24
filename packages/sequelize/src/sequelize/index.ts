import { Sequelize } from 'sequelize';
import { isBoolean, isUndefined } from '@wxjs/shared';
import { ConnectionOptions } from './types';
import { checkConnectionOptions } from './_utils';
import { createError } from '../errors';
import { logger } from '../_logger';

export { Sequelize } from 'sequelize';

export async function defineSequelizeConnection(options: ConnectionOptions): Promise<Sequelize> {
  let sequelize: Sequelize;
  checkConnectionOptions(options);

  const { logging, verbose, ...passingOptions } = options;
  const _verbose = isUndefined(verbose) ? false : verbose;

  let _logging;
  if (isBoolean(logging) || isUndefined(logging)) {
    _logging = logging;
  } else {
    _logging = (sql: string) => logging(sql);
  }

  try {
    sequelize = new Sequelize({
      ...passingOptions as object,
      logging: _logging
    });

    if (_verbose) {
      logger.log('Env is development. Check connection...');
      await sequelize.sync({ logging: () => {} });
      logger.log('Connection is done.');
    }
  } catch (error: any) {
    throw createError({
      name: 'ConnectionError',
      message: 'Something wrong connection',
      cause: error
    });
  }

  // // @ts-ignore
  // const modelsDefs: ModelDefinition[] = (await import('#internal/sequelize/models'))?.models;
  // const modelsNeedAssociate: Required<ModelDefinitionResult>[] = [];
  //
  // if (!modelsDefs) spawnError(new Error(`Something wrong... ${process.dev ? '(modelsDefs is not array)' : ''}`));
  //
  // for (const modelDef of modelsDefs.filter((modelDef) => modelDef.__model_def__)) {
  //   let returnValue = modelDef(sequelize, DataTypes);
  //   let returnLiteral = returnValue?.toString();
  //
  //   if (returnLiteral === '[object Promise]') {
  //     returnValue = await returnValue;
  //     returnLiteral = returnValue?.toString();
  //   }
  //
  //   if (returnValue) {
  //     // Promise тут уже зарезолвлен, компилятор ts не понимает этого...
  //     // Глупый компилятор:)
  //     // @ts-ignore
  //     if (returnValue.association) {
  //       // @ts-ignore
  //       modelsNeedAssociate.push(returnValue);
  //     }
  //   }
  // }
  //
  // for (const modelAssociateFn of modelsNeedAssociate) {
  //   // sequelize.models содержит ровно тоже самое, что и ModelsMap, просто там другие типы
  //   // должно работать:)
  //   // @ts-ignore
  //   const returnValue = modelAssociateFn.association(sequelize.models as ModelsMap);
  //   const returnLiteral = returnValue?.toString();
  //
  //   if (returnLiteral === '[object Promise]') {
  //     await returnValue;
  //   }
  // }

  return sequelize;
}

export function useSequelize(container: Record<string, any> & { sequelize?: Sequelize }): Sequelize | undefined {
  if (!container.sequelize) {
    throw createError({
      name: 'SequelizeNotFoundError',
      message: 'useSequelize->container[sequelize] not found'
    });
  }

  return container.sequelize;
}
