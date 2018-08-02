[![Build Status](https://travis-ci.org/wayfair/data-snap.svg?branch=master)](https://travis-ci.org/wayfair/data-snap)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/wayfair/data-snap/branch/master/graph/badge.svg)](https://codecov.io/gh/wayfair/data-snap)

# data-snap

`data-snap` is a generic mock data manager **for JavaScript tests**, that helps you use data from real endpoints in tests.

On first run / update, `data-snap` executes the thunk (which returns a promise), and then writes the result of the promise to disk to avoid network calls on subsequent test runs.

A `__data_snapshots__` is created adjacent to your test file (similar to Jest's `__snapshots__`), with the same name as your test file. Mock data is stored within that file.

You can then update your data by rerunning your specs with a `--updateSnapshot`/`-u` flag, or by deleting the snapshot file.

Data snapshots should be committed to version control, as regular snapshot files are. The snapshot file is then used in CI.

### Installing

```
npm i --save-dev data-snap
```

## Usage

```javascript
import dataSnap from 'data-snap';

// hits endpoint on first run; resolves from disk on 2nd
const fetchData = id => fetch(`/api/${id}`).then(r => r.json());

test('some-spec', async () => {
  const data = await dataSnap('key', () => fetchData(1));
  expect(data.a).toBe(true);
});
```

##### Expires

The data is never actually expired (to avoid CI unintentionally triggering an Ajax call, etc). However, if you would like to be reminded with a console warning to update your data periodically, set an expires flag.

```
const ONE_MONTHISH = 1000 * 60 * 60 * 24 * 30;
dataSnap('key', thunkPromise, {expires: Date.now() + ONE_MONTHISH});
```

## API

```
thunkSnap<D>(
  name: string,
  thunkPromise: () => Promise<D>,
  opts: {expires?: number} = {}
): Promise<D>
```

`--updateSnapshot`/`-u` will re execute your data fetcher (`jest --updateSnapshot`).

## Running the tests

```
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
