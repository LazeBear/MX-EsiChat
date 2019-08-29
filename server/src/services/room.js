const Room = require('../models/room');
const Service = require('./service');

class RoomService extends Service {
  async createOne(room, namespaceId) {
    const id = `${namespaceId}_${room.name.replace(/ /g, '-')}`;
    const document = new this.Model({
      ...room,
      _id: id,
      namespace: namespaceId
    });
    await document.save();
    return document;
  }

  async getRoomsByNS(ns) {
    console.log(ns);
    return this.Model.find({ namespace: ns }).exec();
  }
}

module.exports = new RoomService(Room);
