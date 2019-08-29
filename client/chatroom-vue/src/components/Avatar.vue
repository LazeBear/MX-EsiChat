<template>
  <Avatar :fullname="name" :radius="10" :size="size || 64" :color="color"></Avatar>
</template>

<script>
import Avatar from "vue-avatar-component";
export default {
  props: ["name", "color", "size"],
  components: { Avatar }
};
</script>

<style lang="scss" scoped>
</style>