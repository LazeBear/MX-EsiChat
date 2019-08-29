<template>
  <div class="workspaces">
    <div v-for="workspace in workspaceList" :key="workspace._id">
      <div class="avatar-wraper" @click="joinWorkspace(workspace._id)">
        <Avatar :name="workspace.name" :color="workspace.color" :size="48"></Avatar>
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
  padding-top: 15px;
}
.add-workspace-btn {
  cursor: pointer;
  color: white;
}

.avatar-wraper {
  cursor: pointer;
}
</style>