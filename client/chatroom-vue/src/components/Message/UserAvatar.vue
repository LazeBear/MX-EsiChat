<template>
  <div class="user-avatar">
    <img :src="iconSrc" />
  </div>
</template>

<script>
export default {
  props: ["name"],
  computed: {
    iconSrc() {
      return `https://robohash.org/${
        this.name
      }.png?size=50x50&set=set${this.hash()}`;
    }
  },
  methods: {
    hash() {
      let hash = 0;
      for (let i = 0; i < this.name.length; i++) {
        const chr = this.name.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return (Math.abs(hash) % 3) + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-avatar {
  margin-right: 10px;
  img {
    min-width: 50px;
    background: #ddd;
    border-radius: 5px;
  }
}
</style>