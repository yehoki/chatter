class roomService {
  private rooms: { name: string; password?: string; userIds: string[] }[] = [];

  createRoom(name: string, firstId: string, password?: string) {
    if (name === '') {
      return -1;
    }
    if (password) {
      return this.rooms.push({ name, password, userIds: [firstId] });
    } else {
      return this.rooms.push({ name, userIds: [firstId] });
    }
  }

  getRoom(roomName: string) {
    const foundRoom = this.rooms.find((room) => room.name === roomName);
    if (!foundRoom)
      return { error: `Could not find room with name ${roomName}` };
    return { foundRoom };
  }

  removeRoom(name: string) {
    const room = this.getRoom(name);
    if (room.error) {
      return room.error;
    }
    this.rooms = this.rooms.filter((room) => room.name === name);
  }

  addUserToRoom(roomName: string, userId: string, userPassword?: string) {
    // Returns 1 on success
    // Returns an error when specified
    // Returns -1 when there has been another problem;
    const { foundRoom, error } = this.getRoom(roomName);
    if (error) {
      return error;
    } else if (foundRoom) {
      if (
        foundRoom.password &&
        userPassword &&
        foundRoom.password === userPassword
      ) {
        // Check the user password is correct and add user to list of users in room
        foundRoom.userIds.push(userId);
        return 1;
      } else if (
        foundRoom.password &&
        userPassword &&
        foundRoom.password !== userPassword
      ) {
        return `The password provided by the user is incorrect`;
      } else if (!foundRoom.password) {
        foundRoom.userIds.push(userId);
        return 1;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  }

  removeUserFromRoom(roomName: string, userId: string) {
    const { foundRoom, error } = this.getRoom(roomName);
    if (error) {
      return error;
    } else if (foundRoom) {
      foundRoom.userIds = foundRoom.userIds.filter((id) => id !== userId);
      return 1;
    } else {
      return -1;
    }
  }

  verifyRoomPassword(roomName: string, password: string) {
    const { foundRoom, error } = this.getRoom(roomName);
    if (error) {
      return error;
    } else if(foundRoom){
      
    }
  }
}

export default roomService;
