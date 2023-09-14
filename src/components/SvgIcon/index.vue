<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    let iconName = computed(() => {
      return `#icon-${props.iconClass}`
    })
    let svgClass = computed(() => {
      if (props.className) {
        return 'el-icon-svg el-icon' + props.className
      } else {
        return 'el-icon-svg el-icon'
      }
    })

    return {
      iconName,
      svgClass
    }
  }
}
</script>

<style scoped>
.el-icon-svg {
  font-size: 15px;
}
</style>

<style>
/* 侧边栏下的icon样式 */
.el-menu-sidebar-nav .el-icon-svg {
  margin-right: 10px;
  margin-left: -4px !important;
}
.hideSidebar .el-icon-svg {
  margin-left: -9px !important;
}
</style>

