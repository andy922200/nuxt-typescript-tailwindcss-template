<script setup lang="ts">
defineOptions({
  name: 'ErrorLayout',
})
</script>

<template>
  <div class="error-layout">
    <h1>There are some Error!</h1>
    <slot />
  </div>
</template>
