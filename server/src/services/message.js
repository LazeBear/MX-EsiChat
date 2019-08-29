const Message = require('../models/message');
const Service = require('./service');
const Logger = require('../utils/logger');

class MessageService extends Service {
  async bulkInsert(messages) {
    await this.Model.insertMany(messages);
    Logger.info('Message data saved to DB');
  }

  async getMessageByRoom(roomId) {
    return this.Model.find({ room: roomId })
      .sort('-time')
      .limit(100)
      .exec();
  }
}

module.exports = new MessageService(Message);
