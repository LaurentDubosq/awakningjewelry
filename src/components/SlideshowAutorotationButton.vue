<script setup lang="ts">
import IconPause from './icons/IconPause.vue'
import IconPlay from './icons/IconPlay.vue'

const { isPlaying } = defineProps<{
  isPlaying: boolean
}>()
</script>

<template>
  <button
    class="slideshow__autorotation-button"
    @click="isPlaying ? $emit('stop-autoplay') : $emit('start-autoplay')"
    @touchstart.stop
    @touchend.stop
    @focusin.stop
    :title="isPlaying ? 'Stop automatic slide show' : 'Start automatic slide show'"
    :aria-label="isPlaying ? 'Stop automatic slide show' : 'Start automatic slide show'"
    data-testid="slideshow__autorotation-button"
  >
    <div class="slideshow__autorotation-button-icon-background">
      <KeepAlive>
        <component
          :is="isPlaying ? IconPause : IconPlay"
          width="18"
          color="white"
          aria-hidden="true"
        />
      </KeepAlive>
    </div>
  </button>
</template>

<style scoped lang="scss">
.slideshow__autorotation-button {
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: -15px;
  cursor: pointer;

  &-icon-background {
    width: 20px;
    height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 5px;
  }
}
</style>
