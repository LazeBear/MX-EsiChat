const Message = require('../models/message');
const Service = require('./service');
const logger = require('../utils/logger');

class MessageService extends Service {
  async bulkInsert(messages) {
    await this.Model.insertMany(messages);
    logger.info('Message data saved to DB');
  }

  async getMessageByRoom(roomId) {
    return this.Model.find({ room: roomId })
      .sort('time')
      .limit(100)
      .lean()
      .exec();
  }
}

module.exports = new MessageService(Message);
