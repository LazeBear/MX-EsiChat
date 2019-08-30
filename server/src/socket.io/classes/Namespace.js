const Client = require('./Client');
const Room = require('./Room');
const roomService = require('../../services/room');
const { fromClient, toClient } = require('../eventList');
const { validateToken } = require('../../utils/jwt');
const logger = require('../../utils/logger');

class Namespace {
  constructor(namespaceObj, io) {
    this._id = namespaceObj._id;
    this._name = namespaceObj.name;
    this._transceiver = io.of(`/${this._id}`);
    this._rooms = [];
    this._roomMap = new Map();
    this._userAndRoomMap = new Map();
    this._users = [];
    this.startListening();
  }

  async prepareRooms() {
    const rooms = await roomService.getRoomsByNS(this._id);
    rooms.forEach(i => {
      this.addRoom(i);
    });
  }

  addRoom(roomObj) {
    this._rooms.push(roomObj);
    this._roomMap.set(roomObj._id, new Room(roomObj, this));
  }

  userJoined(user) {
    this._users.push(user);
    logger.info(`user joined ${this._name}: ${user.name}`);
  }

  userLeft(user) {
    const index = this._users.findIndex(i => i.id === user.id);

    this._users.splice(index, 1);
  }

  async startListening() {
    await this.prepareRooms();
    logger.info(`NS ${this._id} start listening`);
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
          socket.emit(toClient.roomList, this._rooms);
          return;
        }
        socket.emit(toClient.errorMsg, 'Authentication overtime');
        socket.disconnect();
      });

      socket.on(fromClient.createRoom, async (roomName, cb) => {
        let newRoom;
        const { _id: user, name: createdBy } = client;
        try {
          newRoom = await roomService.createOne(
            { name: roomName, user, createdBy },
            this._id
          );
        } catch (e) {
          if (e.code === 11000) {
            return cb({ success: false, msg: 'Room name already exist!' });
          }
          logger.error(e);
          return cb({
            success: false,
            msg: 'Creation failed, please try later!'
          });
        }
        this.addRoom(newRoom);
        cb({
          success: true,
          msg: `Room ${roomName} created`
        });
        socket.emit(toClient.roomCreated, newRoom);
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

  getTransceiver() {
    return this._transceiver;
  }

  getRoomObjById(id) {
    this._roomMap.get(id);
  }
}

module.exports = Namespace;
