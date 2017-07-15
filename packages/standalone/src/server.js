import WebSocket from 'ws';
import express from 'express';
import http from 'http';
import path from 'path';

const
    app = express(),
    server = http.createServer(app),
    root = process.cwd(),
    files = new Map();

app.get('*.js', (req, res) => {
    const src = req.path.replace(/^\//, '');
    if (files.has(src)) {
        res.send(files.get(src));
    } else {
        res.status(404).send({ error: 'Not Found' });
    }
});

function start(port) {
    server.listen(port, () => {});

    const wss = new WebSocket.Server({ server });

    return {
        reload(filePath, file) {
            const src =
                encodeURIComponent(path.relative(root, filePath));
            files.set(src, file);
            wss.clients.forEach(client => {
                if (client.readyState = WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        src,
                        filePath,
                        message: 'reload',
                    }));
                }
            });
        },
    };
}

export { start };
