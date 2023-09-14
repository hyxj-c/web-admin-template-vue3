<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <template v-for="(item, index) in data.levelList">
        <el-breadcrumb-item v-if="item.meta.title" :key="item.path">
          <span v-if="item.redirect==='noredirect' || index===data.levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import pathToRegexp from 'path-to-regexp'
import { useRoute, useRouter } from 'vue-router'
import { reactive, watch } from 'vue'

const route = useRoute()
const router = useRouter()

// 数据
const data = reactive({
  levelList: []
})

// 监听
watch(() => route.path, () => {
  getBreadcrumb()
})

// created
getBreadcrumb()

// 方法
function getBreadcrumb() {
  let matched = route.matched.filter(item => {
    if (item.name) {
      return true
    }
  })
  const first = matched[0]
  if (first && first.name !== 'Dashboard') {
    matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
  }
  data.levelList = matched
}

// 点击面包屑导航时切换路由
function handleLink(item) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(pathCompile(path))
}

function pathCompile(path) {
  // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
  const { params } = route
  var toPath = pathToRegexp.compile(path)
  return toPath(params)
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
