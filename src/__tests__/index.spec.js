/* eslint-env jest */
import rimraf from 'rimraf';
import dataSnap from './../index';
import fs from 'fs';

const snapshotDir = `${__dirname}/__data_snapshots__`;

const fetchData = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({foo: 'bar'});
    }, 20);
  });

let mockPromise;
let mockThunk;

beforeEach(() => {
  mockPromise = jest.fn(fetchData);
  mockThunk = jest.fn(mockPromise);
  rimraf.sync(snapshotDir);
});

test('calls thunk on first run', async () => {
  const data = await dataSnap('a', mockThunk);
  expect(mockPromise.mock.calls.length).toBe(1);
  expect(mockThunk.mock.calls.length).toBe(1);
  expect(data.foo).toBe('bar');
});

test('writes a __data_snapshot__ file to disk', async () => {
  expect(fs.existsSync(snapshotDir)).toBe(false);
  await dataSnap('b', mockThunk);
  expect(fs.existsSync(snapshotDir)).toBe(true);
});

test('resolves from disk on 2nd hit', async () => {
  await dataSnap('c', mockThunk);
  const data = await dataSnap('c', mockThunk);
  expect(mockPromise.mock.calls.length).toBe(1);
  expect(mockThunk.mock.calls.length).toBe(1);
  expect(data.foo).toBe('bar');
});

test('calls update', async () => {
  await dataSnap('d', mockThunk);
  process.argv.push('--updateSnapshot');
  const data = await dataSnap('d', mockThunk);
  process.argv.pop();
  expect(mockPromise.mock.calls.length).toBe(2);
  expect(mockThunk.mock.calls.length).toBe(2);
  expect(data.foo).toBe('bar');
});

test('logs expiry info but stil resolves from disk', async () => {
  await dataSnap('e', mockThunk, {expires: Date.now()});
  const spy = jest.spyOn(global.console, 'log').mockImplementation(() => {});
  const data = await dataSnap('e', mockThunk);
  expect(spy.mock.calls.length).toBe(1);
  expect(
    spy.mock.calls[0][0].includes(
      '__tests__/index.spec.js is expired - please update!'
    )
  );
  expect(mockPromise.mock.calls.length).toBe(1);
  expect(mockThunk.mock.calls.length).toBe(1);
  expect(data.foo).toBe('bar');
});
