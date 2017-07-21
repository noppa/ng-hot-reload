
const logger = type => (...messages) => {
  const console_ = typeof console !== 'undefined' ? console : {};
  if (typeof console_[type] === 'function') {
    console_[type](...messages);
  } else if (typeof console_.log === 'function') {
    console_.log(...messages);
  }
};

const
  debug = logger('log'),
  warn  = logger('warn'),
  error = logger('error');

export { debug, warn, error };
