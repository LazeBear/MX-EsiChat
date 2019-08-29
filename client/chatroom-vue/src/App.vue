<template>
  <div class="app-content">
    <Workspaces></Workspaces>
    <Rooms></Rooms>
    <ChatArea></ChatArea>
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
  mounted() {
    this.checkAuth();
    this.showLoginModal();
  },
  watch: {
    user(val) {
      if (!val) {
        this.showLoginModal();
      }
    }
  },
  methods: {
    showLoginModal() {
      this.$buefy.modal.open({
        parent: this,
        component: LoginModal,
        hasModalCard: true,
        canCancel: false,
        customClass: "custom-class custom-class-2"
      });
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
