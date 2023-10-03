class userService {
  private users: { username: string; id: string; room: string }[] = [];

  addUser(id: string, username: string, room: string) {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const userExists = this.users.find(
      (user) => user.room === room && user.username === username
    );
    if (userExists) {
      return {
        error: `Username ${username} already exists in this room, please try a different one.`,
      };
    }
    const newUser = {
      id,
      username,
      room,
    };
    this.users.push(newUser);
    return { newUser };
  }

  removeUser(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
    return;
  }

  getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  getUsersInRoom(room: string) {
    return this.users.filter((user) => user.room === room);
  }
}

export default userService;
