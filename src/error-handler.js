

const log = (msg) => {
  console.error(msg);
};

const controllerUpdateError = (moduleName, controllerName, err) => {
  log(`Full page refresh required.
Could not initialize ${moduleName}.${controllerName}: ${err}`);
};


export {log, controllerUpdateError};
