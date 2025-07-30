<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps<{
  overlayClass?: string
  bgClass?: string
  spinnerClass?: string
}>()
</script>

<template>
  <div
    class="spinner-overlay absolute inset-0 z-30 flex items-center justify-center"
    :class="[props.overlayClass]"
  >
    <div
      class="spinner-bg pointer-events-none absolute inset-0 bg-[rgba(216,213,213,0.6)]"
      :class="[props.bgClass]"
    />
    <ProgressSpinner :class="['size-8', props.spinnerClass]" stroke-width="8" />
  </div>
</template>
