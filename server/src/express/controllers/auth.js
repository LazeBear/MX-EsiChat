const userService = require('../../services/user');
const { generateToken, validateToken } = require('../../utils/jwt');

module.exports = {
  login: async (req, res) => {
    const { name, password } = req.body;
    const user = await userService.validateUser(name, password);
    if (!user) return res.status(401).send('Invalid username or password');
    delete user.password;

    const token = generateToken({ id: user._id, name: user.name });
    return res.json({ user, token });
  },
  refreshToken: async (req, res) => {
    const authHeader = req.header('Authorization');
    const decoded = validateToken(authHeader);
    if (!decoded) {
      return res.json('invalidToken');
    }
    const user = { id: decoded.id, name: decoded.name };
    const token = generateToken(user);
    return res.json({ user, token });
  }
};
