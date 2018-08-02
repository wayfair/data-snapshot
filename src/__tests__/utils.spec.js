import {callingFilePath} from '../utils';

const windowsErrorStack = `Error
    at dataSnapshot (C:\\Users\\me\\data-snapshot\\src\\index.js:56:22)
    at _callee5$ (C:\\Users\\me\\data-snapshot\\src\\__tests__\\index.spec.js:148:38)
    at tryCatch (C:\\Users\\me\\data-snapshot\\node_modules\\regenerator-runtime\\runtime.js:62:40)
    at Generator.invoke [as _invoke] (C:\\Users\\me\\data-snapshot\\node_modules\\regenerator-runtime\\runtime.js:296:22)
    at Generator.prototype.(anonymous function) [as next] (C:\\Users\\me\\data-snapshot\\node_modules\\regenerator-runtime\\runtime.js:114:21)
    at step (C:\\Users\\me\\data-snapshot\\src\\__tests__\\index.spec.js:17:191)
    at C:\\Users\\me\\data-snapshot\\src\\__tests__\\index.spec.js:17:437
    at new Promise (<anonymous>)
    at Object.<anonymous> (C:\\Users\\me\\data-snapshot\\src\\__tests__\\index.spec.js:17:99)
    at Object.asyncFn (C:\\Users\\me\\data-snapshot\\node_modules\\jest-jasmine2\\build\\jasmine_async.js:82:37)
    at resolve (C:\\Users\\me\\data-snapshot\\node_modules\\jest-jasmine2\\build\\queue_runner.js:52:12)
    at new Promise (<anonymous>)
    at mapper (C:\\Users\\me\\data-snapshot\\node_modules\\jest-jasmine2\\build\\queue_runner.js:39:19)
    at promise.then (C:\\Users\\me\\data-snapshot\\node_modules\\jest-jasmine2\\build\\queue_runner.js:73:82)
    at <anonymous>`;

const macErrorStack = `Error
    at dataSnapshot (/Users/me/data-snapshot/src/index.js:53:20)
    at _callee5$ (/Users/me/data-snapshot/src/__tests__/index.spec.js:148:38)
    at tryCatch (/Users/me/data-snapshot/node_modules/regenerator-runtime/runtime.js:62:40)
    at Generator.invoke [as _invoke] (/Users/me/data-snapshot/node_modules/regenerator-runtime/runtime.js:296:22)
    at Generator.prototype.(anonymous function) [as next] (/Users/me/data-snapshot/node_modules/regenerator-runtime/runtime.js:114:21)
    at step (/Users/me/data-snapshot/src/__tests__/index.spec.js:17:191)
    at /Users/me/data-snapshot/src/__tests__/index.spec.js:17:437
    at new Promise (<anonymous>)
    at Object.<anonymous> (/Users/me/data-snapshot/src/__tests__/index.spec.js:17:99)
    at Object.asyncFn (/Users/me/data-snapshot/node_modules/jest-jasmine2/build/jasmine_async.js:82:37)
    at resolve (/Users/me/data-snapshot/node_modules/jest-jasmine2/build/queue_runner.js:52:12)
    at new Promise (<anonymous>)
    at mapper (/Users/me/data-snapshot/node_modules/jest-jasmine2/build/queue_runner.js:39:19)
    at promise.then (/Users/me/data-snapshot/node_modules/jest-jasmine2/build/queue_runner.js:73:82)
    at <anonymous>`;

test('handles windows error', () => {
  expect(callingFilePath(windowsErrorStack)).toBe(
    'C:\\Users\\me\\data-snapshot\\src\\__tests__\\index.spec.js'
  );
});

test('handles mac error', () => {
  expect(callingFilePath(macErrorStack)).toBe(
    '/Users/me/data-snapshot/src/__tests__/index.spec.js'
  );
});
