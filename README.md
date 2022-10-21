[![Build Status](https://travis-ci.org/wayfair/data-snapshot.svg?branch=master)](https://travis-ci.org/wayfair/data-snapshot)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/wayfair/data-snapshot/branch/master/graph/badge.svg)](https://codecov.io/gh/wayfair/data-snapshot)
[![npm version](https://badge.fury.io/js/data-snapshot.svg)](https://badge.fury.io/js/data-snapshot)
[![license](https://img.shields.io/github/license/wayfair/data-snapshot.svg)](https://github.com/wayfair/data-snapshot/blob/master/LICENSE.md)

# data-snapshot 📸

`data-snapshot` is a generic mock data manager **for JavaScript tests**, that helps you use data from real endpoints in tests.

On first run / update, `data-snapshot` executes the thunk (which returns a promise), and then writes the result of the promise to disk to avoid network calls on subsequent test runs.

A `__data_snapshots__` is created adjacent to your test file (similar to Jest's `__snapshots__`), with the same name as your test file. Mock data is stored within that file.

You can then update your data by rerunning your specs with a `--updateSnapshot`/`-u` flag, or by deleting the snapshot file.

Data snapshots should be committed to version control, as regular snapshot files are. The snapshot file is then used in CI.

### Installing

```bash
npm i --save-dev data-snapshot
```

## Usage

```javascript
import dataSnapshot from 'data-snapshot';

// hits endpoint on first run; resolves from disk on 2nd
const fetchData = id => fetch(`/api/${id}`).then(r => r.json());

test('some-spec', async () => {
  const data = await dataSnapshot('key', () => fetchData(1));
  expect(data.a).toBe(true);
});
```

##### Expires

The data is never actually expired (to avoid CI unintentionally triggering an Ajax call, etc). However, if you would like to be reminded with a console warning to update your data periodically, set an expires flag.

```javascript
const ONE_MONTHISH = 1000 * 60 * 60 * 24 * 30;
dataSnapshot('key', thunkPromise, {expires: Date.now() + ONE_MONTHISH});
```

## API

```javascript
dataSnapshot<D>(
  name: string,
  thunkPromise: () => Promise<D>,
  opts: {expires?: number} = {}
): Promise<D>
```

`--updateSnapshot`/`-u` will re execute your data fetcher (`jest --updateSnapshot`).

## Running the tests

```bash
npm test
```

## Built With

- [Babel](https://babeljs.io/)
- [Flow](https://flow.org/)
- [Jest](https://jestjs.io/)

## Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our Code of Conduct.

To contribute, please open an issue, or submit a pull request with appropriate test coverage.

## License

This project is licensed under the BSD-2-Clause license - see the [LICENSE.md](LICENSE.md) file for details
