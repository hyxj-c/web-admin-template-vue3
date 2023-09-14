<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <!-- 左侧导航 -->
    <Sidebar class="sidebar-container"/>
    <!-- 导航右侧 -->
    <div class="main-container">
      <!-- 上方导航 -->
      <Navbar/>
      <!-- Tabs标签 -->
      <TagsView/>
      <!-- 主内容区域 -->
      <AppMain/>
    </div>
  </div>
</template>

<script>
import { Sidebar, Navbar, TagsView, AppMain } from './components'
import useResizeHandler from './hooks/ResizeHandler'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  setup() {
    const store = useStore()

    // 计算属性
    const sidebar = computed(() => {
      return store.getters.sidebar 
    })

    let device = computed(() => {
      return store.getters.device
    })

    const classObj = computed(() => {
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === 'mobile'
      }
    })

    // 使用组合式函数
    useResizeHandler(device, sidebar)
    
    // 方法
    function handleClickOutside() {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    return {
      sidebar,
      device,
      classObj,
      handleClickOutside
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  // 主体区域
  .main-container {
    min-height: 100%;
    transition: margin-left .28s;
    margin-left: 200px;
    position: relative;
  }
  // 侧边栏
  .sidebar-container {
    transition: width 0.28s;
    width: 200px;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
  // 侧边栏隐藏时
  .hideSidebar {
    .sidebar-container {
      width: 50px;
    }
    .main-container {
      margin-left: 50px;
    }
  }
  .withoutAnimation {
    .main-container,
    .sidebar-container {
      transition: none;
    }
  }
   //适配移动端
  .mobile {
    .main-container {
      margin-left: 0px;
    }
    .sidebar-container {
      transition: transform .28s;
      width: 180px !important;
    }
    &.hideSidebar {
      .sidebar-container {
        transition-duration: 0.3s;
        transform: translate3d(-180px, 0, 0);
      }
    }
  }
</style>