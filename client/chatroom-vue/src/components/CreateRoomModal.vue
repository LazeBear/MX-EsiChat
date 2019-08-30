<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Create new room</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Room name">
        <b-input
          type="text"
          v-model="name"
          placeholder="name"
          required
          v-on:keyup.enter.native="create"
        ></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary" @click="create" :disabled="!name">Create</button>
    </footer>
  </div>
</template>

<script>
import mixin from "../utils/mixin";
export default {
  data() {
    return {
      name: ""
    };
  },
  methods: {
    create() {
      if (!this.name) {
        return;
      }
      this.createNewRoom(this.name);
      this.$parent.close();
    }
  },
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
</style>