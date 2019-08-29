const Namespace = require('../models/namespace');
const Service = require('./service');

class NamespaceService extends Service {
  async createOne(namespace) {
    const id = namespace.name.replace(/ /g, '-');
    const document = new this.Model({ _id: id, ...namespace });
    await document.save();
    return document;
  }
}

module.exports = new NamespaceService(Namespace);
