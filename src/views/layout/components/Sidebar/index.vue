<template>
  <div>
    <Logo :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        class="el-menu-sidebar-nav"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <SidebarItem v-for="route in routes" :key="route.path" :route="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const store = useStore()
const route = useRoute()
const router = useRouter()

/* 计算属性 */
const sidebar = computed(() => store.getters.sidebar)
const routes = computed(() => router.options.routes)
let isCollapse = computed(() => !sidebar.value.opened)
</script>

<style lang="scss">
// rest element-plus css
.el-scrollbar {
  height: calc(100% - 50px); // logo = 50px
  .scrollbar-wrapper {
    .el-scrollbar__view {
      height: 100%;
    }
    .el-menu-sidebar-nav {
      height: 100%;
      width: 100%;
      border-right: none;
    }
    .el-sub-menu.is-active > .el-sub-menu__title{
      color: #f4f4f5 !important;
    }
    .el-menu--collapse .el-sub-menu__title {
      padding-right: 0px;
    }
  }
}
</style>