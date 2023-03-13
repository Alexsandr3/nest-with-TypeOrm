import fs, { existsSync, mkdirSync } from 'node:fs';
import path, { dirname } from 'node:path';
// import * as process from 'process';

/**
 *
 * @param relativePath (relative path of running app)
 */

export const readTextFileAsync = (relativePath: string) => {
  return new Promise((resolve, reject) => {
    const rootDirPath = dirname(require.main.filename);
    const filePath = path.join(rootDirPath, relativePath);
    fs.readFile(filePath, { encoding: 'utf-8' }, (error, content) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(content);
    });
  });
};

/**
 *
 * @param relativePath (relative path of running app)
 */

export const saveFileAsync = (relativePath: string, nameFile: string, data: Buffer) => {
  return new Promise<void>((resolve, reject) => {
    // const rootDirPath = process.cwd();
    const rootDirPath = dirname(require.main.filename);
    const filePath = path.join(rootDirPath, relativePath, nameFile);
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve();
    });
  });
};

export const ensureDirSync = (relativePath: string): void => {
  // const rootDirPath = process.cwd();
  const rootDirPath = dirname(require.main.filename);
  const dirPath = path.join(rootDirPath, relativePath);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};
