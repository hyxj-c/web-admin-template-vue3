<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">用户名:{{ name }}</div> -->
    <div class="dashboard-text">用户名:</div>
    <div class="dashboard-text">
      用户角色:
      <!-- <span v-for="(role, index) in roles" :key="role"><span v-if="index > 0">、</span>{{ role }}</span> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    // ...mapGetters(["name", "roles"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    margin-bottom: 20px;
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
