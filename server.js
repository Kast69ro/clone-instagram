import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});

let peers = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('peerId', (peerId) => {
    peers.add(peerId);
    socket.peerId = peerId;
    console.log('Peer added:', peerId);

    socket.broadcast.emit('newPeer', peerId);
  });

  socket.on('disconnect', () => {
    if (socket.peerId) {
      peers.delete(socket.peerId);
      console.log('Peer removed:', socket.peerId);

      socket.broadcast.emit('removePeer', socket.peerId);
    }
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
