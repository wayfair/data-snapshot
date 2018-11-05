/**
 * data-snapshot utils
 *
 * @flow
 */

// Generate a stacktrace and get the filepath of where dataSnapshot was called
export const callingFilePath = (stack: string) => {
  // Return test path when running with Jest
  if (global.expect && typeof global.expect.getState === 'function') {
    return global.expect.getState().testPath;
  }
  const callingFileStack = stack.split('\n')[2].split(/\s/);
  const callingFile =
    callingFileStack[callingFileStack.length - 1]
      .replace(/[()]/, '')
      .split('.js')[0] + '.js';

  return callingFile;
};
