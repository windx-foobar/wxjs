import { type NitroModule, type NitroOptions } from 'nitropack';
import fsp from 'node:fs/promises';
import { defu } from 'defu';
import { genSafeVariableName } from 'knitwork';
import * as pathe from 'pathe';
import { isPlainObject } from '@windx-foobar/shared';
import { scanModelsFolder, type ConnectionOptions } from '@windx-foobar/sequelize';
import { getName, useLogger, createResolver, addPlugin, type _Nitro } from './_kit';

const NAME = getName();

export async function createConfig(nitro: _Nitro) {
  const { resolve } = createResolver(import.meta.url);
  const { buildDir } = nitro.options;
  const buildDirTypesDir = pathe.resolve(buildDir, 'types');

  const nitroConfig = nitro.options as (NitroOptions & { sequelize: ConnectionOptions & { models?: { dir?: string }; migrations?: { dir?: string } } });
  const nitroTsConfig = nitroConfig.typescript;
  const sequelizeOptions = nitroConfig.sequelize;
  const typesDir = resolve(nitroConfig.buildDir, 'types');

  const modelsDir = resolve(nitroConfig.rootDir, sequelizeOptions.models?.dir);
  const migrationsDir = resolve(nitroConfig.rootDir, sequelizeOptions.migrations?.dir);
  const storageDir = sequelizeOptions.dialect === 'sqlite' ? resolve(nitroConfig.rootDir, sequelizeOptions.storage) : undefined;
  const scannedModelsItems = await scanModelsFolder(modelsDir);
  const modelsMap = scannedModelsItems
    .map((item) => {
      return `${item.modelName}: typeof import("${pathe.relative(buildDirTypesDir, item.fullPathWithoutExt)}").${item.modelName}`;
    })
    .join('\n');

  nitroConfig.alias ||= {};
  nitroConfig.virtual ||= {};
  nitroConfig.scanDirs ||= [];
  nitroTsConfig.tsConfig ||= {};

  nitroConfig.externals = defu(isPlainObject(nitroConfig.externals) ? nitroConfig.externals : {}, {
    inline: [resolve('./runtime')] as any
  });

  nitroConfig.alias['#wxjs/sequelize'] = resolve('./runtime/service');
  nitroConfig.alias['#wxjs/sequelize/extra'] = resolve('../node_modules', '@windx-foobar/sequelize/dist/extra');

  const scannedModelsItemsImports = scannedModelsItems
    .map((item) => {
      return `import ${genSafeVariableName(item.fullPathHash)} from '${item.fullPathWithoutExt}'`;
    })
    .join('\n');
  const scannedModelsItemsNames = scannedModelsItems
    .map((item) => genSafeVariableName(item.fullPathHash))
    .join(',\n');
  nitroConfig.virtual['#internal/sequelize/models'] = `
${scannedModelsItemsImports}

export const models = [
  ${scannedModelsItemsNames}
];
      `;

  nitroConfig.runtimeConfig.sequelize = defu(nitroConfig.runtimeConfig.sequelize, {
    ...sequelizeOptions,
    storage: storageDir,
    migrations: { dir: migrationsDir },
    models: { dir: modelsDir }
  });

  if (nitroConfig.dev) {
    nitroConfig.devServer.watch ||= [];
    nitroConfig.devServer.watch.push(resolve('../src'));
  }

  const createTypes = () => {
    return [
      {
        name: 'nitro-sequelize.d.ts',
        content: [
          '/// <reference path="./nitro-sequelize-alias.d.ts" />',
          '/// <reference path="./nitro-sequelize-env.d.ts" />'
        ].join('\n')
      },
      {
        name: 'nitro-sequelize-alias.d.ts',
        content: [
          `declare module '#wxjs/sequelize' {`,
          `  export * from '${pathe.relative(buildDirTypesDir, resolve('./runtime/service'))}'`,
          '}',
          `declare module '#wxjs/sequelize/extra' {`,
          `  export * from '@windx-foobar/sequelize/extra'`,
          '}'
        ].join('\n')
      },
      {
        name: 'nitro-sequelize-env.d.ts',
        content: [
          `declare module '@windx-foobar/sequelize' {`,
          '  interface ModelsMap {',
          `    ${modelsMap}`,
          '  }',
          '}',
          // `declare module 'h3' {`,
          // `  interface H3Context`,
          // '}'
          'export {}'
        ].join('\n')
      }
    ];
  };
  const writeTypes = async () => {
    nitroTsConfig.tsConfig!.include ||= [];
    nitroTsConfig.tsConfig!.include!.push('./nitro-sequelize.d.ts');

    await Promise.all(
      createTypes().map(async (typeMeta) => {
        await fsp.writeFile(resolve(typesDir, typeMeta.name), typeMeta.content);
      })
    );
  };
  const _addPlugin = () => {
    addPlugin(nitro, resolve('./runtime/plugin'));
  };

  return { createTypes, writeTypes, addPlugin: _addPlugin };
}

export default <NitroModule>{
  name: NAME,
  async setup(nitro) {
    const logger = useLogger();

    logger.info('Setup starting');

    const { writeTypes, addPlugin } = await createConfig(nitro as _Nitro);

    await writeTypes();
    addPlugin();

    logger.info('Setup is done!');
  }
};
