const io = require('../servers').io;
const namespaceService = require('../services/namespace');
const roomService = require('../services/room');
const { fromClient, toClient } = require('./eventList');
const Namespace = require('./classes/Namespace');
const { validateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const namespaceMap = new Map();
const namespaceList = [];
const users = new Set();

async function init() {
  namespaceList.push(...(await namespaceService.getAll()));
  namespaceList.forEach(i => {
    namespaceMap.set(i._id, new Namespace(i, io));
  });
  startListening();
}

function startListening() {
  io.on('connection', async socket => {
    const authTimeout = setTimeout(() => {
      socket.emit(toClient.errorMsg, 'Authentication failed');
      socket.disconnect();
    }, 2000);
    socket.emit(toClient.askForAuthenticate, token => {
      clearTimeout(authTimeout);
      const decodedToken = validateToken(token);
      if (decodedToken) {
        socket.user = decodedToken;
        if (users.has(decodedToken.name)) {
          // eliminate duplicate connections
          // return socket.disconnect();
          logger.warn(
            'Multiple login detected with user: ' + decodedToken.name
          );
        }
        users.add(socket.user.name);
        logger.info('user joined lobby: ' + socket.user.name);
        socket.emit(toClient.namespaceList, namespaceList);
        return;
      }
      socket.emit(toClient.errorMsg, 'Authentication failed');
      socket.disconnect();
    });

    socket.on(fromClient.createNamespace, async (payload, cb) => {
      let newNamespace;
      const { id: user, name: createdBy } = socket.user;
      try {
        newNamespace = await namespaceService.createOne({
          ...payload,
          user,
          createdBy
        });
      } catch (e) {
        if (e.code === 11000) {
          return cb({ success: false, msg: 'Workspace name already exist!' });
        }
        logger.error(e);
        return cb({
          success: false,
          msg: 'Creation failed, please try later!'
        });
      }
      cb({
        success: true,
        msg: `Workspace ${newNamespace.name} created!`,
        ns: newNamespace
      });
      await roomService.createOne(
        { name: 'general', user, createdBy },
        newNamespace._id
      );
      namespaceMap.set(newNamespace._id, new Namespace(newNamespace, io));
      namespaceList.push(newNamespace);
      io.emit(toClient.namespaceCreated, newNamespace);
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        users.delete(socket.user.name);
        logger.info('user left lobby: ' + socket.user.name);
      }
    });
  });
}

init();

module.exports = io;
