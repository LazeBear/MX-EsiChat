const express = require('express');
const { login, refreshToken } = require('../controllers/auth');

const router = express.Router();

router.post('/', login);
router.post('/tokenRefresh', refreshToken);

module.exports = router;
