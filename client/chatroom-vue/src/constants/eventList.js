exports.toServer = {
  createNamespace: 'create namespace',
  joinNamespace: 'join namespace',
  leaveNamespace: 'leave namespace',
  createRoom: 'create room',
  joinRoom: 'join room',
  leaveRoom: 'leave room',
  newMsg: 'new message from client'
};

exports.fromServer = {
  namespaceCreated: 'namespace created',
  namespaceList: 'namespace list',
  roomList: 'room list',
  roomHistory: 'room history',
  newMsg: 'new message to client',
  askForAuthenticate: 'ask for authenticate',
  errorMsg: 'error message',
  msgHistory: 'message history'
};
