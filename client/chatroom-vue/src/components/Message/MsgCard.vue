<template>
  <div v-if="msg" class="msg-card">
    <div class="left">
      <UserAvatar :name="msg.name"></UserAvatar>
    </div>
    <div class="right">
      <div class="header">
        <div class="name">{{msg.name}}</div>
        <div class="time">{{time}}</div>
      </div>

      <div class="content">{{msg.content}}</div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "./UserAvatar";
import dayjs from "dayjs";

export default {
  props: ["msg"],
  components: {
    UserAvatar
  },
  computed: {
    time() {
      return dayjs(this.msg.time).format("h:mm A - D MMM");
    }
  }
};
</script>

<style lang="scss" scoped>
.msg-card {
  display: flex;
  margin-bottom: 10px;
}
.header {
  * {
    display: inline-block;
  }
  .name {
    font-weight: bold;
    margin-right: 10px;
    font-size: 1.1rem;
  }
  .time {
    font-weight: lighter;
    font-size: 0.9rem;
  }
}
</style>