import { createConfig } from '@wxjs/nitro-sequelize';
import { type ConnectionOptions } from '@wxjs/sequelize';
import { defineNuxtModule, addTemplate, createResolver, addServerPlugin } from '@nuxt/kit';
import { defu } from 'defu';
import { getName } from './_kit';

export interface ModuleOptions extends ConnectionOptions {
  models?: { dir: string };
  migrations?: { dir: string };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: getName(),
    configKey: 'sequelize',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: <any>{
    migrations: {
      dir: './server/database/migrations'
    },
    models: {
      dir: './server/database/models'
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeConfig = nuxt.options.runtimeConfig;

    // @ts-ignore
    nuxt.hook('nitro:config', async (nitroConfig) => {
      const { createTypes } = await createConfig({
        options: Object.assign(nitroConfig, {
          sequelize: defu(runtimeConfig.sequelize || {}, options),
          devServer: nuxt.options.devServer
        })
      });

      createTypes()
        .forEach((typeMeta) => {
          addTemplate({
            filename: `types/${typeMeta.name}`,
            getContents: () => typeMeta.content
          });
        });
    });

    addServerPlugin(resolve('../node_modules', '@wxjs/nitro-sequelize/dist/runtime/plugin'));

    // @ts-ignore
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/nitro-sequelize.d.ts') });
    });
  }
});
