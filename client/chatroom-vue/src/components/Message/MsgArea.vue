<template>
  <div class="msg-area">
    <div v-for="msg in roomHistory" :key="msg.name+msg.time">
      <MsgCard :msg="msg"></MsgCard>
    </div>
  </div>
</template>

<script>
import mixin from "../../utils/mixin";
import MsgCard from "./MsgCard";
export default {
  mixins: [mixin],
  components: {
    MsgCard
  },
  updated() {
    const elem = this.$el;
    elem.scrollTop = elem.scrollHeight;
  }
};
</script>

<style lang="scss" scoped>
.msg-area {
  overflow-y: scroll;
}
</style>