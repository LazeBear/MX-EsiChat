<template>
  <div class="rooms">
    <div class="workspace-name">{{currentNS}}</div>
    <div class="room-list">
      <div
        v-for="room in roomList"
        :key="room._id"
        class="room"
        :class="currentRoom === room._id?'active':''"
        @click="joinRoom(room._id)"
      >
        <b-tooltip :label="`created by ${room.createdBy}`" type="is-dark" position="is-bottom">
          <div class="room-name">{{ room.name }}</div>
        </b-tooltip>
      </div>
    </div>

    <div class="add-room" @click="createRoom">+ Add a room</div>
  </div>
</template>

<script>
import mixin from "../utils/mixin";
import CreateRoomModal from "./CreateRoomModal";
export default {
  mixins: [mixin],
  methods: {
    createRoom() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateRoomModal,
        hasModalCard: true
      });
    }
  },
  components: {
    CreateRoomModal
  }
};
</script>

<style lang="scss" scoped>
.workspace-name {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  margin: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.room-list {
  overflow-y: scroll;
  flex: 1;
}
.rooms {
  min-width: 240px;
  max-width: 240px;
  background-color: #333;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  color: white;
  font-size: 1.2rem;
}
.add-room,
.room {
  cursor: pointer;
  padding: 2px 15px;
}
.room {
  &.active {
    font-weight: bold;
    background-color: #714cd3;
  }

  span {
    width: 100%;
  }

  &-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.add-room {
  margin-top: 10px;
  text-align: center;
}
</style>