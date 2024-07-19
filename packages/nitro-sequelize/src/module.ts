import { type NitroModule, type NitroOptions } from 'nitropack';
import fsp from 'node:fs/promises';
import { defu } from 'defu';
import { genSafeVariableName } from 'knitwork';
import * as pathe from 'pathe';
import { isPlainObject } from '@windx-foobar/shared';
import { scanModelsFolder, type ConnectionOptions } from '@windx-foobar/sequelize';
import * as mlly from 'mlly';

import { getName, useLogger, createResolver, addPlugin, type _Nitro } from './_kit';

const NAME = getName();

export async function createConfig(nitro: _Nitro, isNuxt: boolean = false) {
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
  nitroTsConfig.tsConfig!.compilerOptions ||= {};
  nitroTsConfig.tsConfig!.compilerOptions.paths ||= {};

  const sequelizeExtraFilePath = await mlly.resolve('@windx-foobar/sequelize/extra');
  const sequelizeExtraURL = new URL(sequelizeExtraFilePath);

  nitroConfig.externals = defu(isPlainObject(nitroConfig.externals) ? nitroConfig.externals : {}, {
    inline: [resolve('./runtime')] as any
  });

  nitroConfig.alias['#wxjs/sequelize'] = resolve('./runtime/service');
  nitroTsConfig.tsConfig!.compilerOptions.paths['#wxjs/sequelize'] = [
    pathe.relative(typesDir, pathe.resolve(typesDir, isNuxt ? 'types' : undefined, './nitro-sequelize-service.d.ts'))
  ];

  nitroConfig.alias['#wxjs/sequelize/extra'] = sequelizeExtraURL.pathname;
  nitroTsConfig.tsConfig!.compilerOptions.paths['#wxjs/sequelize/extra'] = [
    pathe.relative(typesDir, pathe.resolve(typesDir, isNuxt ? 'types' : undefined, './nitro-sequelize-extra.d.ts'))
  ];

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
          '/// <reference path="./nitro-sequelize-env.d.ts" />'
        ].join('\n')
      },
      {
        name: 'nitro-sequelize-service.d.ts',
        content: `export * from '${pathe.relative(buildDirTypesDir, resolve('./runtime/service'))}'`
      },
      {
        name: 'nitro-sequelize-extra.d.ts',
        content: `export * from '${pathe.relative(typesDir, new URL('./extra', sequelizeExtraURL).pathname)}'`
      },
      {
        name: 'nitro-sequelize-env.d.ts',
        content: [
          `declare module '@windx-foobar/sequelize' {`,
          '  interface NitroModelsMap {',
          `    ${modelsMap}`,
          '  }',
          '}',
          'export {}'
        ].join('\n')
      }
    ];
  };
  const writeTypes = async () => {
    nitroTsConfig.tsConfig!.include ||= [];
    nitroTsConfig.tsConfig!.include!.push('./nitro-sequelize.d.ts');

    try {
      await fsp.opendir(resolve(typesDir));
    } catch (error) {
      await fsp.mkdir(resolve(typesDir), { recursive: true });
    }

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
