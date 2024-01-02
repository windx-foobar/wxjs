import { type NitroModule } from 'nitropack';
import fsp from 'node:fs/promises';
import { defu } from 'defu';
import { genInlineTypeImport, genSafeVariableName } from 'knitwork';
import { normalize } from 'pathe';
import { isPlainObject } from '@wxjs/shared';
import { scanModelsFolder, type ConnectionOptions } from '@wxjs/sequelize';
import { getName, useLogger, createResolver, addPlugin } from './_kit';

const NAME = getName();

export default <NitroModule>{
  name: NAME,
  async setup(nitro) {
    const logger = useLogger();
    const { resolve } = createResolver(import.meta.url);

    logger.info('Setup starting');

    const nitroConfig = nitro.options;
    const nitroTsConfig = nitroConfig.typescript;
    const sequelizeOptions = nitroConfig.sequelize as (ConnectionOptions & { models?: { dir?: string }; migrations?: { dir?: string } });
    const typesDir = resolve(nitroConfig.buildDir, 'types');

    const modelsDir = resolve(nitroConfig.rootDir, sequelizeOptions.models?.dir);
    const migrationsDir = resolve(nitroConfig.rootDir, sequelizeOptions.migrations?.dir);
    const storageDir = sequelizeOptions.dialect === 'sqlite' ? resolve(nitroConfig.rootDir, sequelizeOptions.storage) : undefined;
    const scannedModelsItems = await scanModelsFolder(modelsDir);
    const modelsMap = scannedModelsItems
      .map((item) => {
        return `${item.modelName}: ${genInlineTypeImport(item.fullPathWithoutExt, item.modelName)}`;
      })
      .join('\n');


    nitroConfig.alias ||= {};
    nitroConfig.virtual ||= {};
    nitroConfig.scanDirs ||= [];
    nitroTsConfig.tsConfig ||= {};

    nitroConfig.externals = defu(isPlainObject(nitroConfig.externals) ? nitroConfig.externals : {}, {
      inline: [resolve('./runtime')]
    });

    nitroConfig.alias['#wxjs/sequelize'] = resolve('./runtime/service');
    nitroConfig.alias['#wxjs/sequelize/extra'] = '@wxjs/sequelize/extra';

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

    addPlugin(nitro, resolve('./runtime/plugin'));

    nitroTsConfig.tsConfig.include ||= [];
    nitroTsConfig.tsConfig.include.push('./nitro-sequelize.d.ts');

    if (nitroConfig.dev) {
      nitroConfig.devServer.watch ||= [];
      nitroConfig.devServer.watch.push(resolve('../src'));
    }

    await fsp.writeFile(
      resolve(typesDir, 'nitro-sequelize.d.ts'),
      [
        '/// <reference path="./nitro-sequelize-alias.d.ts" />',
        '/// <reference path="./nitro-sequelize-env.d.ts" />'
      ].join('\n')
    );
    await fsp.writeFile(
      resolve(typesDir, 'nitro-sequelize-alias.d.ts'),
      [
        `declare module '#wxjs/sequelize' {`,
        `  export * from '${resolve('./runtime/service')}'`,
        '}',
        `declare module '#wxjs/sequelize/extra' {`,
        `  export * from '@wxjs/sequelize/extra'`,
        '}'
      ].join('\n')
    );
    await fsp.writeFile(
      resolve(typesDir, 'nitro-sequelize-env.d.ts'),
      [
        `declare module '@wxjs/sequelize' {`,
        '  interface ModelsMap {',
        `    ${modelsMap}`,
        '  }',
        '}',
        // `declare module 'h3' {`,
        // `  interface H3Context`,
        // '}'
        'export {}'
      ].join('\n')
    );

    logger.info('Setup is done!');
  }
};
