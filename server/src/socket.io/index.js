const io = require('../servers').io;
const namespaceService = require('../services/namespace');
const roomService = require('../services/room');
const { fromClient, toClient } = require('./eventList');
const Namespace = require('./classes/Namespace');
const { validateToken } = require('../utils/jwt');

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
          return socket.disconnect();
        }
        users.add(socket.user.name);
        console.log('user in lobby', [...users]);
        socket.emit(toClient.namespaceList, namespaceList);
        return;
      }
      socket.emit(toClient.errorMsg, 'Authentication failed');
      socket.disconnect();
    });

    socket.on(fromClient.createNamespace, async payload => {
      console.log(payload);
      const newNamespace = await namespaceService.createOne(payload);
      await roomService.createOne({ name: 'general' }, newNamespace._id);
      namespaceMap.set(newNamespace._id, new Namespace(newNamespace, io));
      namespaceList.push(newNamespace);
      io.emit(toClient.namespaceCreated, newNamespace);
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        users.delete(socket.user.name);
        console.log(socket.user.name + ' left');
      }
    });
  });
}

init();

module.exports = io;
