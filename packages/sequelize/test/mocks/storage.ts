import type { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as fsp from 'node:fs/promises';
import { resolve } from 'pathe';

export function useTmpStorage() {
  const rootPath = fileURLToPath(new URL('../.tmp', import.meta.url));

  const _read = async (name?: string) => {
    const path = name ? resolve(rootPath, name) : rootPath;

    const buf = await fsp.readFile(path);
    return buf.toString();
  };
  const _tryRead = async (name?: string) => {
    try {
      const content = await _read(name);
      return content;
    } catch (error) {
      return null;
    }
  };
  const write = async (name: string, content: Parameters<typeof writeFile>[1]) => {
    const isExistsRoot = await _tryRead();

    if (isExistsRoot === null) {
      await fsp.mkdir(rootPath, { recursive: true });
    }

    await fsp.writeFile(resolve(rootPath, name), content);
  };
  const tryWrite = async (name: string, content: Parameters<typeof writeFile>[1]) => {
    try {
      await write(name, content);
      return true;
    } catch (error) {
      return false;
    }
  };
  const getFullPath = (name: string) => resolve(rootPath, name);

  return {
    dir: rootPath,
    getFullPath,
    read: (name: string) => _read(name),
    tryRead: (name: string) => _tryRead(name),
    write,
    tryWrite
  };
}
