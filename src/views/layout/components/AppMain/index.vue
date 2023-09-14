<template>
  <section class="app-main scroll-bar">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: "AppMain",
  setup() {
    const store = useStore()

    // 计算属性
    let cachedViews = computed(() => {
      return store.getters.cachedViews
    })

    return {
      cachedViews
    }
  }
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  43 = tags-view*/
  position: relative;
  height: calc(100vh - 50px - 43px);
  overflow: auto;
}
</style>
