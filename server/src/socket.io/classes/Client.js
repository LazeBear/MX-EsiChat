const logger = require('../../utils/logger');

class Client {
  constructor(user, socket) {
    this._socket = socket;
    this._roomId = null;
    this._room = null;
    this.name = user.name;
    this._id = user.id;
  }

  sendMsgToRoom(msg) {
    if (!this._room) {
      logger.error('No room exist');
      return;
    }
    this._room.broadcast({ name: this.name, content: msg, user: this._id });
  }

  joinRoom(room) {
    this._socket.join(room._id);
    this._roomId = room._id;
    this._room = room;
    room.sendHistoryToClientSocket(this._socket);
  }

  // leave the room and return the room left
  leaveLastRoom() {
    if (!this._roomId) {
      return null;
    }
    this._socket.leave(this._roomId);
    this._room = null;
    return this._roomId;
  }
}
module.exports = Client;
