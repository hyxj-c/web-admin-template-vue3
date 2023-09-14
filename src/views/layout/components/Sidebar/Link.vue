
<template>
  <a v-if="isExternalLink(to)" :href="to" target="_blank" rel="noopener">
    <slot/>
  </a>
  <router-link v-else :to="to">
    <slot/>
  </router-link>
</template>

<script>
import { isExternal } from '@/utils'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup() {
    function isExternalLink(routePath) {
      return isExternal(routePath)
    }

    return {
      isExternalLink
    }
  }
}
</script>
