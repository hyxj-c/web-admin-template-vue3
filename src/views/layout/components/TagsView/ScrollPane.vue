<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { onMounted, ref } from 'vue'

/* emit */
const emit = defineEmits(['scroll'])

/* ref引用 */
const scrollContainer = ref(null)

/* 数据 */
const tagAndTagSpacing = 4 // tagAndTagSpacing
let scrollWrapperDiv = null

/* 声明周期钩子 */
onMounted(() => {
  scrollWrapperDiv = scrollContainer.value.wrapRef
  scrollWrapperDiv.addEventListener('scroll', emitScroll, true)
})

/* 函数 */
function emitScroll() {
  emit('scroll')
}

function handleScroll(e) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  scrollWrapperDiv.scrollLeft = scrollWrapperDiv.scrollLeft + eventDelta / 4
}

function moveToTarget(currentTag, tagList) {
  const containerDiv = scrollContainer.value.$el
  const containerDivWidth = containerDiv.offsetWidth

  let firstTag = null
  let lastTag = null

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (firstTag === currentTag) {
    scrollWrapperDiv.scrollLeft = 0
  } else if (lastTag === currentTag) {
    scrollWrapperDiv.scrollLeft = scrollWrapperDiv.scrollWidth - containerDivWidth
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex(item => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > scrollWrapperDiv.scrollLeft + containerDivWidth) {
      scrollWrapperDiv.scrollLeft = afterNextTagOffsetLeft - containerDivWidth
    } else if (beforePrevTagOffsetLeft < scrollWrapperDiv.scrollLeft) {
      scrollWrapperDiv.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

defineExpose({
  moveToTarget
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 60px;
    }
  }
}
</style>
