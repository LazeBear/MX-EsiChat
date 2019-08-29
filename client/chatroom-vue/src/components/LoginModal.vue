<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{loginMode? 'Login':'Register'}}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Username">
        <b-input
          type="text"
          required
          validation-message="Please use 2 to 10 characters or numbers"
          pattern="^[A-Za-z0-9]{1,10}$"
          v-model="username"
          placeholder="Your display name"
          minlength="2"
          maxlength="10"
        ></b-input>
      </b-field>

      <b-field label="Password">
        <b-input
          type="password"
          v-model="password"
          password-reveal
          placeholder="Your password"
          required
          minlength="4"
          v-on:keyup.enter.native="submit"
        ></b-input>
      </b-field>

      <!-- <b-checkbox v-if="loginMode">Remember me</b-checkbox> -->
    </section>
    <footer class="modal-card-foot">
      <!-- <button class="button" type="button" @click="$parent.close()">Close</button> -->
      <button class="button" type="button" @click="changeMode">{{loginMode? 'Register':'Login'}}</button>
      <button
        class="button is-primary"
        @click="submit"
        :loading="isLoggingIn"
        :disabled="!validateInput"
      >{{loginMode? 'Login':'Register'}}</button>
    </footer>
  </div>
</template>

<script>
import mixin from "../utils/mixin";
export default {
  data() {
    return {
      username: "",
      password: "",
      loginMode: true
    };
  },
  computed: {
    validateInput() {
      const usernameRegex = new RegExp("^[A-Za-z0-9]{1,10}$");
      console.log(usernameRegex.test(this.username));
      console.log(this.password.length >= 4);
      return usernameRegex.test(this.username) && this.password.length >= 4;
    }
  },
  methods: {
    changeMode() {
      this.loginMode = !this.loginMode;
    },
    submit() {
      if (!this.validateInput) {
        return;
      }
      const user = { name: this.username, password: this.password };
      if (this.loginMode) {
        this.login(user);
      } else {
        this.register(user);
      }
    }
  },
  watch: {
    user(val) {
      if (val) {
        this.$parent.close();
        this.connectToWS();
      }
    }
  },
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.modal-card {
  width: 320px;
  &-title {
    text-align: center;
  }
  &-foot {
    display: flex;
    justify-content: space-around;
  }
}
</style>