const Client = require('./Client');
const Room = require('./Room');
const roomService = require('../../services/room');
const { fromClient, toClient } = require('../eventList');
const { validateToken } = require('../../utils/jwt');

class Namespace {
  constructor(namespaceObj, io) {
    this._id = namespaceObj.id;
    this._name = namespaceObj.name;
    this._transceiver = io.of(`/${this._id}`);
    this._rooms = [];
    this._roomMap = new Map();
    this._userAndRoomMap = new Map();
    this._users = [];
    this.startListening();
  }

  async prepareRooms() {
    this._rooms = await roomService.getRoomsByNS(this._id);
    this._rooms.forEach(i => {
      this._roomMap.set(i._id, new Room(i, this));
    });
  }

  addRoom(roomObj) {
    this._rooms.push(roomObj);
  }

  userJoined(user) {
    this._users.push(user);
  }

  userLeft(user) {
    const index = this._users.findIndex(i => i.id === user.id);
    this._users.splice(index, 1);
  }

  async startListening() {
    await this.prepareRooms();
    let client;
    this._transceiver.on('connection', socket => {
      const authTimeout = setTimeout(() => {
        socket.emit(toClient.errorMsg, 'Authentication failed');
        socket.disconnect();
      }, 2000);
      socket.emit(toClient.askForAuthenticate, token => {
        clearTimeout(authTimeout);
        const decodedToken = validateToken(token);
        if (decodedToken) {
          client = new Client(decodedToken, socket);
          this.userJoined(client);
          console.log('user in ' + this._name, this._users);
          socket.emit(toClient.roomList, this._rooms);
          return;
        }
        socket.emit(toClient.errorMsg, 'Authentication failed');
        socket.disconnect();
      });

      socket.on(fromClient.joinRoom, roomId => {
        // check if roomId exist
        if (!this._roomMap.has(roomId)) {
          return;
        }
        const room = this._roomMap.get(roomId);
        // leave last room first
        client.leaveLastRoom();
        // join new room
        client.joinRoom(room);
      });

      socket.on(fromClient.newMsg, msg => {
        client.sendMsgToRoom(msg);
      });

      socket.on('disconnect', () => {
        this.userLeft(client);
        client = null;
      });
    });
  }

  broadcastToRoom(room, event, payload) {
    this._transceiver.to(room).emit(event, payload);
  }

  getTransceiver() {
    return this._transceiver;
  }

  getRoomObjById(id) {
    this._roomMap.get(id);
  }
}

module.exports = Namespace;
