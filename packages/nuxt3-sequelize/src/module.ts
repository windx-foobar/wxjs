import { createConfig } from '@windx-foobar/nitro-sequelize';
import { type ConnectionOptions } from '@windx-foobar/sequelize';
import { defineNuxtModule, addTemplate, createResolver, addServerPlugin } from '@nuxt/kit';
import { defu } from 'defu';
import * as mlly from 'mlly';
import { getName } from './_kit';

type ModuleOptions = ConnectionOptions & {
  models?: { dir: string };
  migrations?: { dir: string };
};

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

    nuxt.hook('nitro:config', async (nitroConfig) => {
      const { createTypes } = await createConfig({
        options: Object.assign(nitroConfig, {
          sequelize: defu(runtimeConfig.sequelize || {}, options),
          devServer: nuxt.options.devServer
        }) as any
      });

      createTypes()
        .forEach((typeMeta) => {
          addTemplate({
            filename: `types/${typeMeta.name}`,
            getContents: () => typeMeta.content
          });
        });
    });

    const nitroPluginURL = new URL(
      './runtime/plugin',
      await mlly.resolve('@windx-foobar/nitro-sequelize')
    );

    addServerPlugin(nitroPluginURL.pathname);

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/nitro-sequelize.d.ts') });
    });
  }
});
