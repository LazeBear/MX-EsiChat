<template>
  <div class="hide-menu">
    <div @click="setHideMenu(!hideMenu)">
      <b-icon :icon="hideMenu?'chevron-right':'chevron-left'" size="is-small" class="menu-icon"></b-icon>
    </div>
  </div>
</template>

<script>
import mixin from "../utils/mixin";
export default {
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.hide-menu {
  display: flex;
  align-items: center;
  font-size: 2rem;
  overflow: hidden;
  min-width: 10px;
}
.menu-icon {
  cursor: pointer;
}
</style>