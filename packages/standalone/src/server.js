import WebSocket from 'ws';
import express from 'express';
import http from 'http';

const
    app = express(),
    files = new Map();

app.get('*.js', (req, res) => {
    const src = req.path.replace(/^\//, '');
    if (files.has(src)) {
        res.send(files.get(src));
    } else {
        res.status(404).send({ error: 'Not Found' });
    }
});

const server = http.createServer(app);

function start(port) {
    server.listen(port, () => {});

    const wss = new WebSocket.Server({ server });

    return {
        /**
         * Asks clients to reload a file.
         * @param {string} path Path to the file.
         * @param {string} file Contents of the file.
         */
        reload(path, file) {
            const src = encodeURIComponent(path);
            files.set(src, file);
            wss.clients.forEach(client => {
                if (client.readyState = WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        src,
                        filePath: path,
                        message: 'reload',
                    }));
                }
            });
        },
    };
}

export { start };
