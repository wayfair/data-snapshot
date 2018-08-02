/**
 * data-snap
 *
 * generic thunk api for storing promise data in a __data_snapshot__ file
 * for use in test to store real mock data
 *
 * @flow
 */
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import {callingFilePath} from './utils';

const shouldUpdate = () => {
  const argv = process.argv.slice(2);
  return ['--updateSnapshot', '-u'].some(d => argv.includes(d));
};

const banner = '// Data Snap v1';

const ensureDirectoryExistence = filePath => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

type ThunkPromise<D> = () => Promise<D>;
type Opts = {expires?: number};

const thunkSnap = <D>(
  dataKey: string,
  thunkPromise: ThunkPromise<D>,
  opts: Opts = {}
): Promise<D> => {
  const callingFile = callingFilePath(new Error().stack);
  const relativeCallingFile = path.relative(process.cwd(), callingFile);

  const basename = `${path.basename(callingFile)}.snap`;
  const snapFile = path.resolve(
    callingFile,
    '..',
    '__data_snapshots__',
    basename
  );

  type Exports = {[string]: {data: *, metadata: {expires?: number}}};
  const exports: Exports = {};

  if (fs.existsSync(snapFile)) {
    // Read a .snap file and assign the exports to our exports var
    eval(fs.readFileSync(snapFile, 'utf8'));
  }

  const settings = {
    expires: Infinity,
    ...opts
  };

  const {data: snapData, metadata: snapMeta} = exports[dataKey] || {};

  if (snapData && !shouldUpdate()) {
    if (snapMeta && snapMeta.expires && snapMeta.expires < Date.now()) {
      // eslint-disable-next-line no-console
      console.log(
        chalk.red(
          `Data "${dataKey}" in ${relativeCallingFile} is expired - please update!`
        )
      );
    }

    return Promise.resolve(snapData);
  }

  // eslint-disable-next-line no-console
  console.log(
    chalk.yellow('Calling thunk promise:\n') +
      `-- file: ${relativeCallingFile}\n-- key: ${dataKey}`
  );

  return thunkPromise().then(data => {
    exports[dataKey] = {
      data,
      metadata: {
        expires: settings.expires
      }
    };

    const newSnap = Object.keys(exports)
      .sort()
      .reduce(
        (acc, key) =>
          acc +
          `\nexports['${key}'] = ${JSON.stringify(exports[key], null, 2)}\n`,
        `${banner}\n`
      );

    ensureDirectoryExistence(snapFile);
    fs.writeFileSync(snapFile, newSnap);
    return data;
  });
};

export default thunkSnap;
