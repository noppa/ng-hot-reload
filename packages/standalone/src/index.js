import * as server from './server.js';
import wrap from './wrap.js';
import FirstPassCache from './first-pass-cache.js';
import through from 'through2';

import clientTemplate from 'raw-loader!./client.tpl.js';
import coreLib from 'raw-loader!ng-hot-reload-core';

module.exports = ngHotReloadStandalone;
module.exports.default = ngHotReloadStandalone;

function ngHotReloadStandalone({
    start = true,
    port = 3100,
    angular = 'angular',
} = {}) {
    let fileServer;

    function startServer() {
        fileServer = server.start(port);
    }

    const
        wrapInitial = wrap({
            firstPassed: false,
            port,
            angular,
        }),
        wrapReload = wrap({
            firstPassed: true,
            port,
            angular,
        });

    /**
     * Reload changed file.
     * @param {string} path Path to the file.
     * @param {string} file File contents.
     * @param {boolean=} [includeClient=false] If true, the standalone client
     *      is appended to the output.
     */
    function reload(path, file, includeClient = false) {
        file = wrapReload(path, file);
        if (includeClient) {
            file = client + file;
        }
        fileServer.reload(path, file);
    }

    function stream(options) {
        let initial, reload, includeClient,
            clientIncluded = false, firstPassCache;

        if (!options) {
            initial = reload = includeClient = true;
        } else {
            initial = Boolean(options.initial);
            reload = Boolean(options.reload);
            includeClient = Boolean(options.includeClient);

            // Sanity checks
            if (!initial && !reload) {
                const msg =
                    `Invalid options in ${JSON.stringify(options)}. At least` +
                    `one of "initial" or "reload" must be set to true!`;
                throw new Error(msg);
            }
        }

        if (initial && reload) {
            firstPassCache = new FirstPassCache();
        }

        return through.obj(function(file, enc, cb) {
            if (/node_modules/.test(file.path)) {
                cb(null, file);
                return;
            }

            let contents = String(file.contents);
            const firstRun =
                initial && (!reload || firstPassCache.pass(file.path));
            const shouldAddClient = includeClient && !clientIncluded;

            if (firstRun) {
                // If we are supposed to handle first runs and this is
                // a first run, wrap the contents with wrapInitial.
                contents = wrapInitial(file.path, contents);
                if (shouldAddClient) {
                    contents = client + contents;
                    clientIncluded = true;
                }
                file.contents = Buffer.from(contents);
            } else {
                // If we are not supposed to handle first runs or the
                // first run has already ended, pass to reload instead.
                reload(file.path, contents, shouldAddClient);
            }

            cb(null, file);
        });
    }

    const clientOptions = {
        ns: 'ng-hot-reload-standalone',
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
            // the exports to options.root[options.ns]['ng-hot-reload-core']
            ${coreLib}

        })(${ JSON.stringify(clientOptions) });
        `;

    if (start) {
        startServer();
    }

    return {
        start: startServer,
        wrap: wrapInitial,
        client,
        reload,
        stream,
    };
};

