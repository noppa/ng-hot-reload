var WebSocket = require('ws');
var clientTemplate = require('raw-loader!./client.tpl.js');

module.exports = function({
    start = true,
    port = 3100,
} = {}) {
    let wss;

    function startServer() {
        if (wss) {
            wss.clients.forEach(ws => {
                ws.terminate();
            });
        }

        wss = new WebSocket.Server({ port });
    }

    function reload({ file, path }) {
        const message = JSON.stringify({
            file,
            path,
        });

        wss.clients.forEach(client => {
            if (client.readyState = WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    const clientOptions = {
        port,
    };

    const client =
`(function(options) {
    options.root = typeof window !== 'undefined' ? window : this;
    options.ns = 'ng-hot-reload-standalone';

    if (options.root) {
        if (options.root[options.ns]) return;
        else options.root[options.ns] = {};
    }

    ${clientTemplate}

})(${ JSON.stringify(clientOptions) });
`;

    if (start) {
        startServer();
    }

    return {
        start: startServer,
        reload,
        client,
    };
};
