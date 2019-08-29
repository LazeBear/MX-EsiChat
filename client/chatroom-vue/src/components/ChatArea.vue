<template>
  <div class="chat-area">
    <div class="msg-area"></div>
    <div class="input-area">
      <b-field>
        <b-input
          placeholder="Enter your message here"
          v-model="msg"
          v-on:keyup.enter.native="onSendMsg"
          rounded
        ></b-input>
      </b-field>
    </div>
  </div>
</template>

<script>
import mixin from "../utils/mixin";
export default {
  methods: {
    onSendMsg() {
      this.sendMsg(this.msg);
      this.msg = "";
    }
  },
  data() {
    return {
      msg: ""
    };
  },
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  .msg-area {
    flex: 1;
  }
  .input-area {
    margin: 10px;
  }
}
</style>