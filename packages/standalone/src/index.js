import wrapFile, { scriptFileReg } from './wrap';
import * as server  from './server';
import through      from 'through2';

import clientTemplate from 'raw-loader!./client.tpl.js';
import coreLib        from 'raw-loader!ng-hot-reload-core';

module.exports = ngHotReloadStandalone;
module.exports.default = ngHotReloadStandalone;

const moduleRegex = /(\/|\\)(node_modules|bower_components)(\/|\\)/;

function ngHotReloadStandalone({
  start = true,
  port = 3100,
  angular = 'angular',
  forceRefresh = true,
  preserveState = true,
  uiRouter = true,
} = {}) {
  const wrapOptions = {
    angular,
    forceRefresh,
    preserveState,
    uiRouter,
    port,
  };
  const wrap = (path, file) => wrapFile(path, file, wrapOptions);

  let fileServer;
  function startServer() {
    fileServer = server.start(port);
  }

  /**
   * Reload changed file.
   * @param {string} path Path to the file.
   * @param {string} file File contents.
   * @param {boolean=} [includeClient=false] If true, the standalone client
   *      is appended to the output.
   */
  function reload(path, file) {
    fileServer.reload(path, file);
  }

  /**
   * Creates a consumer for gulp file streams.
   *
   * The source files need to be wrapped using the `wrap` function
   * on the first load and then passed to `reload` function
   * when there's a change.
   *
   * This function can be used in place or with the normal `reload`
   * and `wrap` functions, for the initial load of the
   * files or for the subsequent reloads of those files,
   * or both.
   *
   * @param {object=} options Options for the consumer.
   *      If omitted, defaults to all options being true.
   * @param {boolean=} [options.initial=true] Use this stream to
   *      wrap the files during the initial load.
   * @param {boolean=} [options.reload=true] Use this stream to
   *      handle the reloads.
   * @param {boolean=} [options.includeClient=true] Use this stream to
   *      include the runtime client. The client is prepended to the
   *      first "valid" file that passes through. Note that if you
   *      set this option to `false`, you need to manually include the file
   *      so that it gets executed before other hot-loaded files.
   * @param {boolean=} [options.ignoreModules] Ignore files that
   *      are in node_modules or bower_components.
   * @return {*} Handler for gulp streams.
   */
  function stream({
    includeClient = true,
    ignoreModules = true,
  } = {}) {
    let clientIncluded = false;

    return through.obj(function(file, enc, cb) {
      if (ignoreModules && moduleRegex.test(file.path)) {
        // Ignore node_modules etc
        cb(null, file);
        return;
      }

      let contents = wrap(file.path, String(file.contents));
      if (scriptFileReg.test(file.path) && includeClient && !clientIncluded) {
        clientIncluded = true;
        contents = client + contents;
      }

      if (fileServer) {
        reload(file.path, contents);
      }

      file.contents = file.isBuffer() ?
        Buffer.from(contents, enc) :
        contents;
      cb(null, file);
    });
  }

  const clientOptions = {
    ns: 'ngHotReloadStandalone',
    port,
  };

  const client =
    `;(function(options) {
        options.root = typeof window !== 'undefined' ? window : this;
        if (options.root) {
            if (options.root[options.ns]) return;
            else options.root[options.ns] = {};
        }

        ${clientTemplate}

        var module;
        var exports = options.root[options.ns];
        // Webpack's generated output for ng-hot-reload-core will load
        // the exports to options.root[options.ns].ngHotReloadCore
        ${coreLib}

    })(${ JSON.stringify(clientOptions) });
    `;

  if (start) {
    startServer();
  }

  return {
    start: startServer,
    wrap,
    client,
    stream,
    reload(path, file) {
      const wrapped = wrap(path, String(file));
      reload(path, wrapped);
      return wrapped;
    },
  };
};
