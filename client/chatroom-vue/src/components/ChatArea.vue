<template>
  <div class="chat-area">
    <MsgArea class="msg-area"></MsgArea>
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
import MsgArea from "./Message/MsgArea";
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
  mixins: [mixin],
  components: {
    MsgArea
  }
};
</script>

<style lang="scss" scoped>
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px;
  .msg-area {
    flex: 1;
  }
  .input-area {
    margin-top: 10px;
  }
}
</style>