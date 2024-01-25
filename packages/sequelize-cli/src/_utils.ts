import { existsSync } from 'node:fs';
import { resolve } from 'pathe';

export function findSequelizeCli(): string | false {
  const tryFind = (path: string): string | false => {
    const fullPath = resolve(path, '.bin/sequelize-cli');
    const isExist = existsSync(fullPath);
    return isExist ? fullPath : false;
  };

  const paths = process.env.NODE_PATH.split(':');

  let finded: string | false = false;

  while (!finded && paths.length) {
    finded = tryFind(paths[0]);
    paths.splice(0, 1);
  }

  return finded;
}
