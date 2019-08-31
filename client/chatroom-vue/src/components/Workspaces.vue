<template>
  <div class="workspaces">
    <div v-for="workspace in workspaceList" :key="workspace._id">
      <div class="avatar-wraper" @click="joinWorkspace(workspace)">
        <Avatar
          :name="workspace.name"
          :class="currentNS === workspace.name?'active':''"
          :color="workspace.color"
          :size="48"
        ></Avatar>
      </div>
    </div>
    <div @click="isModalActive = true">
      <b-icon icon="plus-box-outline" size="is-medium" class="add-workspace-btn"></b-icon>
    </div>
    <b-modal :active.sync="isModalActive">
      <AddNewWorkspaceForm></AddNewWorkspaceForm>
    </b-modal>
  </div>
</template>

<script>
import AddNewWorkspaceForm from "./AddNewWorkspaceForm";
import mixin from "../utils/mixin";
import Avatar from "./Avatar";
export default {
  data() {
    return {
      isModalActive: false
    };
  },
  mixins: [mixin],
  components: {
    AddNewWorkspaceForm,
    Avatar
  }
};
</script>

<style lang="scss" scoped>
.workspaces {
  min-width: 60px;
  max-width: 60px;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  overflow-y: auto;
}
.add-workspace-btn {
  cursor: pointer;
  color: white;
  margin-top: 5px;
}

.avatar-wraper {
  cursor: pointer;

  .active {
    border: 2px solid white;
    border-radius: 5px;
  }
}
</style>