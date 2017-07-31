import getOptions from '../options';

const console_ = typeof console !== 'undefined' ? console : {};

const logger = (type, level) => (...messages) => {
  const logLevel = levels.indexOf(getOptions().logLevel);
  // Ignore debug messages if getOptions().logLevel === 'warn' for example
  if (logLevel === -1 || logLevel > level) return;

  if (typeof console_[type] === 'function') {
    console_[type](...messages);
  } else if (typeof console_.log === 'function') {
    console_.log(...messages);
  }
};

const levels = ['debug', 'warn', 'error'];
const
  debug = logger('log', 0),
  warn  = logger('warn', 1),
  error = logger('error', 2);

export { debug, warn, error };
