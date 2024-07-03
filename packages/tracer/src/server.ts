import { WebSocketServer } from 'ws';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 8080;

const app = express();

const buildPath = path.join(__dirname, './build');

app.use(express.static(buildPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);

  const ws = new WebSocketServer({ port: 50006 });

  ws.on('connection', (socket) => {
    console.log('bridge is connected');

    socket.on('message', (message) => {
      console.log({ message: message.toString() });
      socket.send(message.toString());
    });

    socket.on('close', () => {
      console.log('bridge disconnected');
    });
  });
});
