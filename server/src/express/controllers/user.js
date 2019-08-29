const userService = require('../../services/user');
const { generateToken } = require('../../utils/jwt');

module.exports = {
  async addUser(req, res) {
    const { password, name } = req.body;

    const existingUser = await userService.checkDuplicateName(name);
    if (existingUser) {
      return res.status(400).send('username already exists');
    }
    const user = await userService.createOne({ name, password });
    delete user.password;
    const token = generateToken({ id: user._id, name: user.name });
    return res.json({ user, token });
  }
};
