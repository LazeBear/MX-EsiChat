import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import auth from './auth';
import { fromServer, toServer } from '../constants/eventList';
import toast from '../utils/toast';

Vue.use(Vuex);

function bindEventListener(context, socket) {
  socket.on(fromServer.namespaceList, payload => {
    toast.showSuccessToast('Login Success');
    context.commit('setWorkspaceList', payload);
  });
  socket.on(fromServer.namespaceCreated, payload => {
    context.commit('addWorkspace', payload);
  });
  socket.on(fromServer.roomList, rooms => {
    context.commit('setRoomList', rooms);
  });
  socket.on(fromServer.roomHistory, rooms => {
    context.commit('setRoomList', rooms);
  });
  socket.on(fromServer.roomCreated, room => {
    context.commit('addRoomList', room);
  });
  socket.on(fromServer.newMsg, msg => {
    context.commit('addRoomHistory', msg);
  });
  socket.on(fromServer.askForAuthenticate, cb => {
    const { token } = context.rootState.auth;
    cb(token);
  });

  socket.on(fromServer.msgHistory, history => {
    context.commit('setRoomHistory', history);
  });

  socket.on('connect_failed', () => {
    toast.showErrorToast('socket connect failed');
  });

  socket.on(fromServer.errorMsg, msg => {
    toast.showErrorToast(msg);
    socket.close();
    context.commit('setSocket', null);
    context.commit('auth/setUser', null, { root: true });
  });

  socket.on('disconnect', reason => {
    // transport close => server closed
    // ping timeout
    // ignore this
    // toast.showErrorToast(`connection lost due to: ${reason}`);
  });

  socket.on('error', msg => {
    console.error('error event from server', msg);
    socket.open();
  });
}

export default new Vuex.Store({
  state: {
    rootSocket: null,
    socket: null,
    workspaceList: [],
    roomList: [],
    roomHistory: [],
    currentNS: null,
    currentRoom: null,
    isLoading: false,
    createNSResponse: null,
    hideMenu: false
  },
  getters: {
    socket: state => {
      return state.socket;
    },
    currentNS: state => {
      return state.currentNS;
    },
    currentRoom: state => {
      return state.currentRoom;
    },
    workspaceList: state => {
      return state.workspaceList;
    },
    hideMenu: state => {
      return state.hideMenu;
    },
    roomList: state => {
      return state.roomList;
    },
    roomHistory: state => {
      return state.roomHistory;
    },
    isLoading: state => {
      return state.isLoading;
    },
    createNSResponse: state => {
      return state.createNSResponse;
    }
  },
  mutations: {
    setHideMenu: (state, hideMenu) => {
      state.hideMenu = hideMenu;
    },
    setRootSocket: (state, rootSocket) => {
      state.rootSocket = rootSocket;
    },
    setSocket: (state, socket) => {
      state.socket = socket;
    },
    setWorkspaceList: (state, workspaceList) => {
      state.workspaceList = workspaceList;
      state.isLoading = false;
    },
    addWorkspace: (state, workspace) => {
      state.workspaceList.push(workspace);
    },
    setCurrentNS: (state, currentNS) => {
      state.currentNS = currentNS;
    },
    setRoomList: (state, roomList) => {
      state.roomList = roomList;
      state.isLoading = false;
    },
    setRoomHistory: (state, roomHistory) => {
      state.roomHistory = roomHistory;
      state.isLoading = false;
    },
    setCurrentRoom: (state, currentRoom) => {
      state.currentRoom = currentRoom;
    },
    loadingRoom: state => {
      state.roomList = [];
      state.isLoading = true;
    },
    loadingHistory: state => {
      state.roomHistory = [];
      state.isLoading = true;
    },
    loadingWorkspace: state => {
      state.workspaceList = [];
      state.isLoading = true;
    },
    addRoomHistory: (state, history) => {
      state.roomHistory.push(history);
    },
    addRoomList: (state, room) => {
      state.roomList.push(room);
    },
    setCreateNSResponse: (state, createNSResponse) => {
      state.createNSResponse = createNSResponse;
    }
  },
  actions: {
    connectToWS(context, workspace) {
      let { rootSocket, socket: oldSocket } = context.state;
      let socket;
      if (rootSocket) {
        if (oldSocket) oldSocket.close();
        context.commit('setSocket', null);
        socket = io(`${process.env.VUE_APP_SOCKET_URL}/${workspace._id}`);
      } else {
        context.commit('loadingWorkspace');
        socket = io(process.env.VUE_APP_SOCKET_URL);
      }

      socket.once('connect', () => {
        if (rootSocket) {
          context.commit('setCurrentNS', workspace.name);
          context.commit('setCurrentRoom', null);
          context.commit('setSocket', socket);
          bindEventListener(context, socket);
        } else {
          context.commit('setRootSocket', socket);
          bindEventListener(context, socket);
        }
      });
    },
    setHideMenu: (context, bool) => {
      context.commit('setHideMenu', bool);
    },
    createNewWorkspace(context, workspace) {
      const { rootSocket } = context.state;
      context.commit('setCreateNSResponse', null);
      rootSocket.emit(toServer.createNamespace, workspace, res => {
        context.commit('setCreateNSResponse', res);
      });
    },
    joinWorkspace(context, workspace) {
      context.commit('loadingRoom');
      context.dispatch('connectToWS', workspace);
    },
    joinRoom(context, room) {
      const { socket } = context.state;
      context.commit('setCurrentRoom', room);
      context.commit('loadingHistory');
      if (window.innerWidth < 700) {
        context.commit('setHideMenu', true);
      }

      socket.emit(toServer.joinRoom, room);
    },
    sendMsg(context, msg) {
      const { socket } = context.state;
      socket.emit(toServer.newMsg, msg);
    },
    createNewRoom(context, roomName) {
      const { socket } = context.state;
      socket.emit(toServer.createRoom, roomName, res => {
        if (res.success) {
          toast.showSuccessToast(res.msg);
        } else {
          toast.showErrorToast(res.msg);
        }
      });
    }
  },
  modules: {
    auth
  }
});
