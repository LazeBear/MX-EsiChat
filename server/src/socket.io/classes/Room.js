const { toClient } = require('../eventList');
const messageService = require('../../services/message');
const logger = require('../../utils/logger');

class Room {
  constructor(roomObj, namespace) {
    this._id = roomObj._id;
    this._name = roomObj.name;
    this._history = [];
    this._historyToBeSaved = [];
    this._historyFetched = false;
    this._transceiver = namespace.getTransceiver();
    this.saveHistoryToDBInterval();
    this.getHistoryFromDB();
  }

  getTransmitter() {
    // it's a transmitter because it can only emit, cannot listen

    return this._transceiver.to(this._id);
  }

  async getHistoryFromDB() {
    const history = await messageService.getMessageByRoom(this._id);
    this._history = [...history];
    this._historyFetched = true;
  }

  saveHistoryToDBInterval() {
    setInterval(() => {
      if (this._historyToBeSaved.length >= 1) {
        messageService.bulkInsert([...this._historyToBeSaved]);
        this._historyToBeSaved = [];
      }
    }, 60000);
  }

  async getHistory() {
    if (!this._historyFetched) {
      await this.getHistoryFromDB();
    }
    return [...this._history];
  }

  broadcast(payload) {
    if (!this._historyFetched) {
      logger.error('Room: history is not fetched yet!');
      return;
    }
    const message = this.addStamp(payload);
    this.saveHistory(message);
    this.getTransmitter().emit(toClient.newMsg, message);
  }

  addStamp(payload) {
    const time = new Date();
    return { ...payload, time, room: this._id };
  }

  saveHistory(message) {
    this._history.push(message);
    this._historyToBeSaved.push(message);
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
