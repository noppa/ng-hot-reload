var WebSocket = require('ws');

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
    }

    if (start) {
        startServer();
    }

    return {
        start: startServer,
    };
};
