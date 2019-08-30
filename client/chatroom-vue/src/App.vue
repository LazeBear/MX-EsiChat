<template>
  <div class="app-content" v-if="user">
    <Workspaces></Workspaces>
    <Rooms v-if="currentNS"></Rooms>
    <ChatArea v-if="currentRoom"></ChatArea>
  </div>
</template>

<script>
import Workspaces from "./components/Workspaces";
import Rooms from "./components/Rooms";
import LoginModal from "./components/LoginModal";
import ChatArea from "./components/ChatArea";
import mixin from "./utils/mixin";
export default {
  name: "app",
  components: {
    Workspaces,
    Rooms,
    ChatArea
  },
  mixins: [mixin],
  data() {
    return {
      loadingComponent: null
    };
  },
  mounted() {
    this.checkAuth();
    this.showLoginModal();
  },
  watch: {
    user(val) {
      if (!val) {
        this.showLoginModal();
      }
    },
    isLoading(val) {
      if (val) {
        this.showLoading();
      } else {
        this.closeLoading();
      }
    }
  },
  methods: {
    showLoginModal() {
      this.$buefy.modal.open({
        parent: this,
        component: LoginModal,
        hasModalCard: true,
        canCancel: false
      });
    },
    showLoading() {
      this.loadingComponent = this.$buefy.loading.open({
        container: null
      });
    },
    closeLoading() {
      setTimeout(() => this.loadingComponent.close(), 500);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.app-content {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
