import axios from '../utils/axios';
import toast from '../utils/toast';

function handleAuthSuccess(context, data) {
  const { user, token } = data;
  context.commit('setUser', user);
  context.commit('setToken', token);
  context.commit('setIsLoggingIn', false);
  localStorage.setItem('token', token);
}

function handleAuthFail(context, msg) {
  toast.showErrorToast(msg);
  context.commit('setIsLoggingIn', false);
}

const state = {
  user: null,
  isLoggingIn: false,
  token: '',
  errorMsg: ''
};

const getters = {
  user: state => {
    return state.user;
  },
  isLoggedIn: state => {
    return !!state.user;
  },
  isLoggingIn: state => {
    return state.isLoggingIn;
  }
};

const mutations = {
  setUser: (state, user) => {
    state.user = user;
  },
  setIsLoggingIn: (state, isLoggingIn) => {
    state.isLoggingIn = isLoggingIn;
  },
  setToken: (state, token) => {
    state.token = token;
  }
};

const actions = {
  login: (context, credentials) => {
    context.commit('setIsLoggingIn', true);
    axios
      .post('/auth', credentials)
      .then(({ data }) => {
        handleAuthSuccess(context, data);
      })
      .catch(e => {
        handleAuthFail(context, e.response.data);
      });
  },
  register: (context, credentials) => {
    context.commit('setIsLoggingIn', true);
    axios
      .post('/users', credentials)
      .then(({ data }) => {
        handleAuthSuccess(context, data);
      })
      .catch(e => {
        handleAuthFail(context, e.response.data);
      });
  },
  checkAuth: context => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post('/auth/tokenRefresh', null, { headers: { authorization: token } })
        .then(({ data }) => {
          handleAuthSuccess(context, data);
        })
        .catch(() => {});
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
