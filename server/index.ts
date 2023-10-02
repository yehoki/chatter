import { Server } from 'socket.io';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? false
        : ['http://localhost:5500', 'http://127.0.0.1:5500'],
  },
});

io.on('connection', (socket) => {
  console.log(`User: ${socket.id} connected`);

  socket.on('join_room', (data: { username: string; room: string }) => {
    console.log(data.username, 'joined room', data.room);
    socket.join(data.room);
    const newDate = new Date();
    socket.broadcast.emit('receive_message', {
      message: `Welcome user ${data}`,
      username: 'ADMIN',
      timeAt: newDate.toUTCString(),
    });
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('message', (data) => {
    io.emit('message', `${socket.id.substring(0, 5)}: ${data}`);
  });
  socket.on('disconnect', () => console.log(`Goodbye user ${socket.id}`));
});