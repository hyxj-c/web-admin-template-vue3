<template v-if = "!route.hidden">
  <!-- 没有子菜单，只展示一个标题导航 -->
  <AppLink v-if="isTitleRoute(route)" :to="resolvePath(titleRoute.path)">
    <el-menu-item :index="resolvePath(titleRoute.path)">
      <SvgIcon v-if="titleRoute.meta.icon" :icon-class="titleRoute.meta.icon"/>
      <template #title>
        {{titleRoute.meta.title}}
      </template>
    </el-menu-item>
  </AppLink>

  <!-- 有子菜单 -->
  <el-sub-menu v-else :index="resolvePath(route.path)">
    <!-- 菜单标题 -->
    <template #title>
      <SvgIcon v-if="route.meta.icon" :icon-class="route.meta.icon" />
      <span>
        {{route.meta.title}}
      </span>
    </template>
    <!-- 子菜单 -->
    <template v-for="child in route.children" >
      <template v-if="!child.hidden">
        <!-- 递归遍历 -->
        <SidebarItem
          v-if="child.children && child.children.length > 0"
          :key="child.path"
          :route="child"
          :base-path="resolvePath(child.path)" />
        <!-- 菜单项 -->
        <AppLink :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)">
            <SvgIcon v-if="child.meta.icon" :icon-class="child.meta.icon" />
            <span>
              {{child.meta.title}}
            </span>
          </el-menu-item>
        </AppLink>
      </template>
    </template>
  </el-sub-menu>
</template>

<script>
import AppLink from './Link'
import path from 'path'
import { isExternal } from '@/utils'
import { shallowReactive, toRefs } from 'vue'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    route: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { basePath } = props

    // 数据
    const data = shallowReactive({
      titleRoute: null
    })

    // 判断children只有一个时，是否只显示此child，不显示父级
    function isTitleRoute(route) {
      // 若路由没有children，直接展示该路由
      if (!route.children || route.children.length === 0) {
        data.titleRoute = route
        return true
      }
      // 过滤隐藏的路由
      const showingChildren = route.children.filter(item => {
        if (item.hidded) {
          return false
        } else {
          return true
        }
      })
      // children为空，直接展示该路由
      if (showingChildren.length === 0) {
        data.titleRoute = route
        return true
      }
      // 仅有一个child，并该child设置了要作为标题路由
      if (showingChildren.length === 1 && showingChildren[0].titleRoute) {
        data.titleRoute = showingChildren[0]
        return true
      }
      return false
    }

    // 解析路径，判断是外部连接还是路由
    function resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      return path.resolve(basePath, routePath)
    }

    return {
      ...toRefs(data),
      isTitleRoute,
      resolvePath
    }
  }
}
</script>
