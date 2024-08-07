<script setup lang="ts">
const { name, group } = defineProps({
  name: { type: String, required: true },
  group: { type: Boolean, default: false },
});
</script>

<template>
  <TransitionGroup :name data-testid="transitionGroup" v-if="group">
    <slot />
  </TransitionGroup>
  <Transition :name data-testid="transition" v-else>
    <slot />
  </Transition>
</template>

<style lang="scss">
@use "@/assets/styles/_constants" as *;

/* fadeHero */
.fadeHero-enter-active,
.fadeHero-leave-active {
  transition: opacity 0.5s ease;
}
.fadeHero-leave-active {
  position: absolute;
  @media screen and (max-width: $AwakningBreakpointDesktop) {
    padding: 0 15px;
  }
}
.fadeHero-enter-from,
.fadeHero-leave-to {
  opacity: 0;
}

/* translateY */
.translateY-enter-active {
  transition: all 0.3s ease;
}
.translateY-leave-active {
  transition: all;
}
.translateY-enter-from,
.translateY-leave-to {
  transform: translateY(-15px);
}

/* marginLeftMinus300px */
.marginLeftMinus300px-enter-active,
.marginLeftMinus300px-leave-active {
  transition: all 0.3s ease;
}
.marginLeftMinus300px-enter-from,
.marginLeftMinus300px-leave-to {
  margin-left: -300px;
}

/* margintopMinus100PerCentWithInner */
.margintopMinus100PerCentWithInner-enter-active .transition,
.margintopMinus100PerCentWithInner-leave-active .transition {
  transition: all 0.3s ease;
}
.margintopMinus100PerCentWithInner-enter-from .transition,
.margintopMinus100PerCentWithInner-leave-to .transition {
  margin-top: -100%;
}
</style>
