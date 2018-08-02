/**
 * data-snap utils
 *
 * @flow
 */

// Generate a stacktrace and get the filepath of where dataSnap was called
export const callingFilePath = (stack: string) => {
  const callingFileStack = stack.split('\n')[2].split(/\s/);
  const callingFile = callingFileStack[callingFileStack.length - 1]
    .replace(/[()]/, '')
    .split('.js')[0] + '.js';

  return callingFile;
};
