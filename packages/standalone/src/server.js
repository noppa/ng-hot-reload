import WebSocket from 'ws';
import express from 'express';
import http from 'http';
import path from 'path';
import { scriptFileReg, htmlFileReg } from './wrap';

const
  app = express(),
  server = http.createServer(app),
  root = process.cwd(),
  files = new Map(),
  getFileType = path =>
    scriptFileReg.test(path) ? 'script'
    : htmlFileReg.test(path) ? 'template'
    : 'unknown';

app.get('*.js', (req, res) => {
  const src = req.path.replace(/^\//, '');
  if (files.has(src)) {
    res.send(files.get(src));
  } else {
    res.status(404).send({
      error: 'Not Found',
    });
  }
});

function start(port) {
  server.listen(port, () => {});

  let clientReady = false;

  const wss = new WebSocket.Server({
    server,
  });

  wss.on('connection', client => {
    client.on('message', data => {
      try {
        const message = JSON.parse(data).message;
        if (message === 'initialized') {
          clientReady = true;
        }
      } catch(err) {
        console.error(err);
      }
    });
  });

  return {
    reload(filePath, file) {
      const src = encodeURIComponent(path.relative(root, filePath));
      const fileType = getFileType(filePath);

      if (fileType === 'script') {
        // The client loads scripts using normal script tags,
        // not eval etc, so we just need to store the file
        // and let client.tpl.js and the express app defined
        // above do the rest.
        files.set(src, file);
      }

      wss.clients.forEach(client => {
        if (client.readyState = WebSocket.OPEN) {
          client.send(JSON.stringify({
            message: 'reload',
            fileType,
            filePath,
            src,
          }));
        }
      });
    },
    isClientReady: () => clientReady,
  };
}

export {
  start,
};
