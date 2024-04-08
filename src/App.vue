<script setup lang="ts">
  import FloorsGrid from '@/components/FloorsGrid.vue'
  import { settingsStore } from '@/stores/settings'

  const settings = settingsStore()
  const { addFloors, reduceFloors } = settings

</script>

<template>
  <!-- DEV -->
  <button style="position: absolute; top: 0; z-index: 100;" @click="addFloors()">add floor</button>
  <button style="position: absolute; top: 25px; z-index: 100;" @click="reduceFloors()">reduce floor</button>
  <!-- DEV -->
  <FloorsGrid />
</template>

<style scoped>
</style>
