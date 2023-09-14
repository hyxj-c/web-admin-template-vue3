<template>
  <div id="tags-view-container" class="tags-view-container">
    <ScrollPane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        class="tags-view-item"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>

    <ul v-show="visible" :style="{left:left+'px', top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(data.selectedTag)">Refresh</li>
      <li v-if="!isAffix(data.selectedTag)" @click="closeSelectedTag(data.selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(data.selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script setup>
import ScrollPane from './ScrollPane'
import path from 'path'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref, watch, nextTick, getCurrentInstance  } from 'vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const currentInstance = getCurrentInstance().proxy

/* ref组件引用 */
const tag = ref(null)
const scrollPane = ref(null)

/* 数据 */
let visible = ref(false)
let top = ref(0)
let left = ref(0)
const data = reactive({
  selectedTag: {},
  affixTags: []
})

/* 计算属性 */
let visitedViews = computed(() => {
  return store.getters.visitedViews
})

const routes =  computed(() => {
  return router.options.routes
})

/* 监听 */
watch(() => route.path, () => {
  addTags()
  moveToCurrentTag()
})

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

/* 生命周期钩子 */
onMounted(() => {
  initTags()
  addTags()
})

/* 函数 */
function initTags() {
  const affixTags = data.affixTags = filterAffixTags(routes.value)
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      store.dispatch('tagsView/addVisitedView', tag)
    }
  }
}

function filterAffixTags(routes, basePath = '/') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

function addTags() {
  const { name } = route
  if (name) {
    store.dispatch('tagsView/addView', route)
  }
}

function isActive(routeParam) {
  return routeParam.path === route.path
}

// 判断是否是固定不可删除标签
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function moveToCurrentTag() {
  const tags = tag.value
  nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === route.path) {
        scrollPane.value.moveToTarget(tag, tags)
        // when query is different then update
        if (tag.to.fullPath !== route.fullPath) {
          store.dispatch('tagsView/updateVisitedView', route)
        }
        break
      }
    }
  })
}

function refreshSelectedTag(view) {
  store.dispatch('tagsView/delCachedView', view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({
        path: '/redirect' + fullPath
      })
    })
  })
}

function closeSelectedTag(view) {
  store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}

function closeOthersTags() {
  router.push(data.selectedTag)
  store.dispatch('tagsView/delOthersViews', data.selectedTag).then(() => {
    moveToCurrentTag()
  })
}

function closeAllTags(view) {
  store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
    if (data.affixTags.some(tag => tag.path === view.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}

function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

function openMenu(tag, e) {
  const menuMinWidth = 105
  const offsetLeft = currentInstance.$el.getBoundingClientRect().left // container margin left
  const offsetWidth = currentInstance.$el.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth // left boundary
  const toContainerLeft = e.clientX - offsetLeft + 15 // 15: margin right

  if (toContainerLeft > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = toContainerLeft
  }

  top.value = e.clientY
  visible.value = true
  data.selectedTag = tag
}

function closeMenu() {
  visible.value = false
}

function handleScroll() {
  if (visible.value) {
    closeMenu()
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  height: 43px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  .tags-view-wrapper {
    height: 42px;
    line-height: 42px;
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      border: 1px solid #eee;
      border-radius: 3px;
      color: #495060;
      background: #fff;
      padding: 0 5px 0 8px;
      font-size: 12px;
      margin-left: 7px;
      &:first-of-type {
        margin-left: 10px;
        padding: 0 8px;
      }
      &:last-of-type {
        margin-right: 10px;
      }
      &.active {
        background-color: #f2f2f2;
        color: #303133;
        border-color: #f2f2f2;
      }
      .el-icon-close {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(.8);
          display: inline-block;
          vertical-align: -1px;
        }
        &:hover {
          background-color: #b2b2b2;
          color: #fff;
        }
        svg {
          vertical-align: -2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>