<script setup lang="ts">
  import FloorsGrid from '@/components/FloorsGrid.vue'
  import ShaftsGrid from '@/components/shafts/ShaftsGrid.vue'
  import { settingsStore } from '@/stores/settings'
  import { storeToRefs } from 'pinia'

  const settings = settingsStore()
  const { shafts, processingCabins } = storeToRefs(settings)
  const { addFloors, reduceFloors, addShafts, reduceShafts, processQueue } = settings

</script>

<template>
  <!-- DEV -->
  <button style="position: absolute; top: 0; right: 0; z-index: 100;" @click="addFloors()">add floor</button>
  <button style="position: absolute; top: 25px; right: 0; z-index: 100;" @click="reduceFloors()">reduce floor</button>

  <button style="position: absolute; top: 50px; right: 0; z-index: 100;" @click="addShafts()">add shaft</button>
  <button style="position: absolute; top: 75px; right: 0; z-index: 100;" @click="reduceShafts()">reduce shaft {{ shafts.length }}</button>
  <button style="position: absolute; top: 100px; right: 0; z-index: 100;" @click="processQueue()">[{{ processingCabins }}]proccess from 2</button>
  <p style="position: absolute; top: 140px; right: 0; z-index: 100;">{{ shafts }}</p>
  <!-- DEV -->
  <FloorsGrid />
  <ShaftsGrid />
</template>

<style scoped>
</style>
