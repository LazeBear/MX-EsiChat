const User = require('../models/user');
const Service = require('./service');

class UserService extends Service {
  async createOne(fields) {
    const document = new this.Model({ _id: fields.name, ...fields });
    await document.hashPassword();
    await document.save();
    return document;
  }

  async checkDuplicateName(name) {
    return this.Model.findById(name);
  }

  async validateUser(name, password) {
    const user = await this.Model.findById(name).select('password name');
    if (!user) {
      return null;
    }
    const validPassword = await user.validatePassword(password);
    return validPassword ? user : null;
  }
}

module.exports = new UserService(User);
