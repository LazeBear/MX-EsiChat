import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      workspaceList: 'workspaceList',
      roomList: 'roomList',
      isLoggingIn: 'auth/isLoggingIn',
      user: 'auth/user'
    })
  },
  methods: {
    ...mapActions({
      connectToWS: 'connectToWS',
      createNewWorkspace: 'createNewWorkspace',
      joinWorkspace: 'joinWorkspace',
      joinRoom: 'joinRoom',
      sendMsg: 'sendMsg',
      login: 'auth/login',
      register: 'auth/register',
      checkAuth: 'auth/checkAuth'
    })
  }
};
