<template>
  <div v-if="roomList.length" class="rooms">
    <div
      v-for="room in roomList"
      :key="room._id"
      class="room"
      @click="joinRoom(room._id)"
    >{{ room.name }}</div>
  </div>
</template>

<script>
import mixin from "../utils/mixin";
export default {
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.rooms {
  min-width: 300px;
  max-width: 300px;
  background-color: gray;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
}
.room {
  color: white;
  cursor: pointer;
}
</style>