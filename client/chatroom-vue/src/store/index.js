import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
import auth from './auth';
import { fromServer, toServer } from '../constants/eventList';
import toast from '../utils/toast';

Vue.use(Vuex);

function bindEventListener(context, socket) {
  socket.on(fromServer.namespaceList, payload => {
    console.log('namelist', payload);
    toast.showSuccessToast('Login Success');
    context.commit('setWorkspaceList', payload);
  });
  socket.on(fromServer.namespaceCreated, payload => {
    console.log('created', payload);
    context.commit('addWorkspace', payload);
  });
  socket.on(fromServer.roomList, rooms => {
    console.log(rooms);
    context.commit('setRoomList', rooms);
  });
  socket.on(fromServer.roomHistory, rooms => {
    console.log(rooms);
    context.commit('setRoomList', rooms);
  });
  socket.on(fromServer.newMsg, msg => {
    console.log(msg);
  });
  socket.on(fromServer.askForAuthenticate, cb => {
    const { token } = context.rootState.auth;
    cb(token);
  });
  socket.on(fromServer.errorMsg, msg => {
    toast.showErrorToast(msg);
    socket.close();
    context.commit('setSocket', null);
    context.commit('auth/setUser', null, { root: true });
  });

  socket.on('connect_failed', () => {
    console.log('connect failed');
  });
  socket.on('disconnect', reason => {
    // transport close => server closed
    // ping timeout
    console.log('connection lost', reason);
    // socket.close();
  });

  socket.on('error', msg => {
    console.log('error event from server', msg);
    // socket.close();
    socket.open();
  });
}

export default new Vuex.Store({
  state: {
    socket: null,
    workspaceList: [],
    roomList: [],
    roomHistory: [],
    currentNS: null
  },
  getters: {
    socket: state => {
      return state.socket;
    },
    workspaceList: state => {
      return state.workspaceList;
    },
    roomList: state => {
      return state.roomList;
    },
    roomHistory: state => {
      return state.roomHistory;
    }
  },
  mutations: {
    setSocket: (state, socket) => {
      state.socket = socket;
    },
    setWorkspaceList: (state, workspaceList) => {
      state.workspaceList = workspaceList;
    },
    addWorkspace: (state, workspace) => {
      state.workspaceList.push(workspace);
    },
    setCurrentNS: (state, currentNS) => {
      state.currentNS = currentNS;
    },
    setRoomList: (state, roomList) => {
      state.roomList = roomList;
    },
    setRoomHistory: (state, roomHistory) => {
      state.roomHistory = roomHistory;
    },
    resetHistory: state => {
      state.roomHistory = [];
    }
  },
  actions: {
    connectToWS(context, workspace) {
      let { socket, currentNS } = context.state;

      if (socket && currentNS) {
        socket.close();
        context.state.socket = null;
      }
      socket = io(
        `${process.env.VUE_APP_SOCKET_URL}${workspace ? `/${workspace}` : ''}`
      );
      socket.once('connect', tst => {
        context.commit('setCurrentNS', workspace);
        context.commit('setSocket', socket);
        bindEventListener(context, socket);
      });
    },
    createNewWorkspace(context, workspace) {
      context.getters.socket.emit(toServer.createNamespace, workspace);
    },
    joinWorkspace(context, workspace) {
      console.log(workspace);
      context.dispatch('connectToWS', workspace);
      // context.getters.socket.emit(toServer.joinNamespace, workspace);
    },
    joinRoom(context, room) {
      const { socket } = context.state;
      context.commit('resetHistory');
      socket.emit(toServer.joinRoom, room);
    },
    sendMsg(context, msg) {
      const { socket } = context.state;
      socket.emit(toServer.newMsg, msg);
    }
  },
  modules: {
    auth
  }
});
