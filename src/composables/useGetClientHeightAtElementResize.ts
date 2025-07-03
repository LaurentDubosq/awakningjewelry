import { onUnmounted, ref, type Ref } from 'vue'

// Composable to use to get element's clientHeight at element resize

/* The call of this composable must be executed in onMounted hook */
export function useGetClientHeightAtElementResize(element: HTMLElement): Ref<number> {
  const clientHeight: Ref<number> = ref(0)

  // Initialization
  const resizeObserver = new ResizeObserver((entries) => {
    clientHeight.value = entries[0].target.clientHeight
  })

  // Execution
  resizeObserver.observe(element)

  // Disconnect the observer at unMounting
  onUnmounted(() => {
    resizeObserver.disconnect()
  })

  return clientHeight
}
