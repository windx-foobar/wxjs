import { type Nitro } from 'nitropack';
import { consola } from 'consola';
import { resolve, dirname, normalize } from 'pathe';
import { fileURLToPath } from "node:url";
import { name } from '../package.json';

export type _Nitro = Partial<Nitro> & Required<Pick<Nitro, 'options'>>;

export function getName() {
  return name;
}

export function useLogger() {
  return consola.withTag(name);
}

export function createResolver(base: string | URL) {
  if (!base) {
    throw new Error("`base` argument is missing for createResolver(base)!");
  }
  base = base.toString();
  if (base.startsWith('file://')) {
    base = dirname(fileURLToPath(base));
  }
  return {
    resolve: (...path: any[]) => resolve(base as string, ...path),
  };
}

export function addPlugin(nitro: _Nitro, plugin: string) {
  nitro.options.plugins ||= [];
  nitro.options.plugins.push(normalize(plugin));
}
