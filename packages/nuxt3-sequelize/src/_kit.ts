import { consola } from 'consola';
import { name } from '../package.json';

export function getName() {
  return name;
}

export function useLogger() {
  return consola.withTag(name);
}
