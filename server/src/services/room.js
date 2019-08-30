const Room = require('../models/room');
const Service = require('./service');

class RoomService extends Service {
  async createOne(room, namespaceId) {
    const id = `${namespaceId}_${room.name.trim().replace(/ /g, '-')}`;
    const document = new this.Model({
      ...room,
      _id: id,
      namespace: namespaceId
    });
    await document.save();
    return document;
  }

  async getRoomsByNS(ns) {
    return this.Model.find({ namespace: ns })
      .lean()
      .exec();
  }
}

module.exports = new RoomService(Room);
