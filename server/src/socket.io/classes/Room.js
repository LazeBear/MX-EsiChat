const { toClient } = require('../eventList');
const messageService = require('../../services/message');
const Logger = require('../../utils/logger');

class Room {
  constructor(roomObj, namespace) {
    this._id = roomObj._id;
    this._name = roomObj.name;
    this._history = [];
    this._historyToBeSaved = [];
    this._historyFetched = false;
    // it's a transmitter because it can only emit, cannot listen
    this._transmitter = namespace.getTransceiver().to(this._id);
    this.saveHistoryToDBInterval();
    this.getHistoryFromDB();
  }

  async getHistoryFromDB() {
    const history = await messageService.getMessageByRoom(this._id);
    this._history = [...history];
    this._historyFetched = true;
    console.log(history);
  }

  saveHistoryToDBInterval() {
    setInterval(() => {
      if (this._historyToBeSaved.length >= 1) {
        messageService.bulkInsert([...this._historyToBeSaved]);
        this._historyToBeSaved = [];
      }
    }, 10000);
  }

  async getHistory() {
    if (!this._historyFetched) {
      await this.getHistoryFromDB();
    }
    return [...this._history];
  }

  broadcast(payload) {
    if (!this._historyFetched) {
      Logger.error('Room: history is not fetched yet!');
      return;
    }
    const message = this.addStamp(payload);

    this._transmitter.emit(toClient.newMsg, message);
  }

  addStamp(payload) {
    const time = new Date();
    return { ...payload, time, room: this._id };
  }

  saveHistory(message) {
    this._history.push(message);
    this.__historyToBeSaved.push(message);
    if (this._historyToBeSaved.length >= 100) {
      messageService.bulkInsert([...this._historyToBeSaved]);
      this._historyToBeSaved = [];
    }
  }

  async sendHistoryToClientSocket(socket) {
    const history = await this.getHistory();
    socket.emit(toClient.msgHistory, history);
  }
}

module.exports = Room;
