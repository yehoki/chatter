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
  enter_room:
    'Event emitted by the server when successfully joins a room, containing all current users in the room',
  verify_password:
    'Event emitted by the server when joining a room is required to verify a password to enter a room',
  error_join:
    'Event emitted by the server when there has been an error joining a room, with the specified error message provided',
};
const users = new userService();
const rooms = new roomService();
io.on('connection', (socket) => {
  console.log(`User: ${socket.id} connected`);
  console.log(users);
  console.log(rooms);

  socket.on(
    'create_room',
    (data: { room: string; password?: string; username: string }) => {
      const getRoom = rooms.getRoom(data.room);
      if (getRoom.foundRoom) {
        socket.emit('room_exists', {
          username: data.username,
          room: data.room,
        });
        return;
      } else {
        rooms.createRoom(data.room, socket.id, data.password);
        users.addUser(socket.id, data.username, data.room);
        console.log(users, rooms);
        socket.join(data.room);
        socket.emit('enter_room', {
          room: data.room,
          username: data.username,
          currentRoomUsers: [
            { username: data.username, room: data.room, id: socket.id },
          ],
        });
        return;
      }
    }
  );

  // Sockets are create when the first user joins them.
  socket.on('join_room', (data: { username: string; room: string }) => {
    const getRoom = rooms.getRoom(data.room);
    // Check a room exists
    if (getRoom.foundRoom) {
      // Password verification necessary to enter the room
      if (getRoom.foundRoom.password) {
        socket.emit('verify_password', data);
        return;
      } else {
        const checkUser = users.addUser(socket.id, data.username, data.room);
        if (checkUser.error) {
          socket.emit('error_join', {
            ...data,
            error: checkUser.error,
          });
          return;
        } else if (checkUser.newUser) {
          const addToRoom = rooms.addUserToRoom(data.room, socket.id);
          if (addToRoom === 1) {
            socket.join(data.room);
            const currentRoomUsers = users.getUsersInRoom(data.room);
            console.log(currentRoomUsers, data);
            socket.emit('enter_room', { ...data, currentRoomUsers });
            socket.to(data.room).emit('new_users', { currentRoomUsers });
            return;
          } else {
            // Error adding user to room
            socket.emit('error_join', {
              ...data,
              error: 'Could not join the room',
            });
            return;
          }
        }
      }
    }
  });

  socket.on(
    'check_password',
    (data: { username: string; room: string; password: string }) => {
      const findRoom = rooms.getRoom(data.room);
      if (findRoom.foundRoom) {
        if (
          findRoom.foundRoom.password &&
          findRoom.foundRoom.password === data.password
        ) {
          const addUserToRoom = rooms.addUserToRoom(
            data.room,
            socket.id,
            data.password
          );
          if (addUserToRoom === 1) {
            const addUser = users.addUser(socket.id, data.username, data.room);
            if (addUser.newUser) {
              socket.join(data.room);
              const currentRoomUsers = users.getUsersInRoom(data.room);
              socket.emit('enter_room', { currentRoomUsers });
              socket.to(data.room).emit('new_users', { currentRoomUsers });
            } else {
              socket.emit(
                'error_join',
                addUser.error || 'Could not join the room'
              );
            }
          } else {
            socket.emit('error_join', 'Could not join the room');
          }
        }
      } else {
        socket.emit('error_join', findRoom.error || 'Could not join the room');
      }
    }
  );

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('message', (data) => {
    io.emit('message', `${socket.id.substring(0, 5)}: ${data}`);
  });

  socket.on('user-typing', (data: { username: string; room: string }) => {
    socket.broadcast
      .to(data.room)
      .emit('user-typing', { username: data.username });
  });

  socket.on('stop-typing', (data: { username: string; room: string }) => {
    socket.broadcast
      .to(data.room)
      .emit('stop-typing', { username: data.username });
  });

  socket.on('disconnect', () => {
    console.log(`Goodbye user ${socket.id}`);
    const user = users.getUser(socket.id);
    users.removeUser(socket.id);
    if (user) {
      socket.broadcast.emit('stop-typing', { username: user.username });
      rooms.removeUserFromRoom(user.room, socket.id);
      const currentRoomUsers = users.getUsersInRoom(user.room);
      // Check if any users left in room
      // If empty: delete room
      if (currentRoomUsers.length > 0) {
        socket.to(user.room).emit('new_users', { currentRoomUsers });
      } else {
        rooms.removeRoom(user.room);
      }
    }
  });
});
