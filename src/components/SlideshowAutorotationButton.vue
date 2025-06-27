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
    @click="$emit('toggleAutoplayExplicitly')"
    @mouseenter="$emit('toggleAutoplay')"
    @mouseleave="$emit('toggleAutoplay')"
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
          class="slideshow__autorotation-button-icon"
          :is="isPlaying ? IconPause : IconPlay"
          width="18"
          aria-hidden="true"
        />
      </KeepAlive>
    </div>
  </button>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_constants.scss' as *;

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
    background-color: $AwakningColorPrimary;
    border-radius: 5px;
  }

  &-icon {
    fill: $AwakningColorSecondary;
  }
}
</style>
