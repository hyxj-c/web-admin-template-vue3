/* sidebar适配移动端 */
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { watch, onBeforeMount, onMounted } from 'vue'

export default function(device, sidebar) {
  const { body } = document
  const WIDTH = 1024
  const RATIO = 3

  const store = useStore()
  const route = useRoute()

  // 监听
  watch(() => route.path, () => {
    if (device.value === 'mobile' && sidebar.value.opened) {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  })

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  })

  function isMobile() {
    const rect = body.getBoundingClientRect()
    return rect.width - RATIO < WIDTH
  }

  function resizeHandler() {
    const mobile = isMobile()

    if (!document.hidden) {
      store.dispatch('app/toggleDevice', mobile ? 'mobile' : 'desktop')

      if (mobile) {
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }
  }
  
}