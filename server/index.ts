import { Server } from 'socket.io';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userService from './services/userService.js';
import roomService from './services/roomService.js';
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

const eventList = {
  connection: 'When a client connects to a socket',
  join_room: 'When a client emits an event to join a specific room',
  verify_password:
    'Event emitted by the server when joining a room is required to verify a password to enter a room',
  duplicate_username:
    'Event emitted by the server when attempting to join with a username which already exists in the same room',
  enter_room:
    'Event emitted by the server when successfully joins a room, containing all current users in the room',
};
const users = new userService();
const rooms = new roomService();
io.on('connection', (socket) => {
  console.log(`User: ${socket.id} connected`);
  console.log(users);

  // Sockets are create when the first user joins them.
  socket.on('join_room', (data: { username: string; room: string }) => {
    const getRoom = rooms.getRoom(data.room);
    if (getRoom.foundRoom) {
      const checkUser = users.addUser(socket.id, data.username, data.room);
      if (checkUser.error) {
        socket.emit('duplicate_username', data);
        return;
      } else {
        const addToRoom = rooms.addUserToRoom(data.room, socket.id);
        if (addToRoom === 1) {
          socket.join(data.room);
          const currentRoomUsers = users.getUsersInRoom(data.room);
          socket.emit('enter_room', { ...data, currentRoomUsers });
          socket.to(data.room).emit('new_users', { currentRoomUsers });
          return;
        } else {
          // Error adding user to room
          return;
        }
      }
    } else {
      rooms.createRoom(data.room);
      const checkUser = users.addUser(socket.id, data.username, data.room);
      if (checkUser.error) {
        socket.emit('duplicate_username', data);
        return;
      } else {
        const addToRoom = rooms.addUserToRoom(data.room, socket.id);
        if (addToRoom === 1) {
          socket.join(data.room);
          const currentRoomUsers = users.getUsersInRoom(data.room);
          socket.emit('enter_room', { ...data, currentRoomUsers });
          socket.to(data.room).emit('new_users', currentRoomUsers);
          return;
        } else {
          // Error adding user to room
          return;
        }
      }
      return;
    }
    // if (getRoom.foundRoom) {
    //   // If the room exists just have to verify password and add user to room

    //   if (getRoom.foundRoom.password) {
    //     return socket.emit('verify_password', data);
    //   } else {
    //     users.addUser(socket.id, data.username, data.room);
    //   }
    //   // users.addUser(socket.id, data.username, data.room);
    //   // rooms.addUserToRoom(data.room, socket.id);
    // }

    // console.log(data.username, 'joined room', data.room);
    // const { newUser, error } = users.addUser(
    //   socket.id,
    //   data.username,
    //   data.room
    // );
    // if (error) {
    //   console.log(error);
    //   return;
    // }
    // socket.join(data.room);
    // const newDate = new Date();
    // console.log('USERS', users.getUsersInRoom(data.room));

    // socket.broadcast.emit('receive_message', {
    //   message: `Welcome user ${data.username}`,
    //   username: 'ADMIN',
    //   timeAt: newDate.toUTCString(),
    //   users: users.getUsersInRoom(data.room),
    // });
    // socket.to(data.room).emit('new_users', {
    //   users: users.getUsersInRoom(data.room),
    // });
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('message', (data) => {
    io.emit('message', `${socket.id.substring(0, 5)}: ${data}`);
  });
  socket.on('disconnect', () => {
    console.log(`Goodbye user ${socket.id}`);
    users.removeUser(socket.id);
  });
});
