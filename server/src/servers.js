const express = require('express');
const socketIO = require('socket.io');
const helmet = require('helmet');

const logger = require('./utils/logger');

const app = express();
app.use(helmet());
// app.use(express.static(__dirname + '/public'));
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);
const io = socketIO(server);

logger.info(`server is listening on port ${PORT}`);

module.exports = {
  app,
  io
};
