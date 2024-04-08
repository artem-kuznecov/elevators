<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  import { settingsStore } from '@/stores/settings'

  const settings = settingsStore()

  const { floors } = storeToRefs(settings)

  const floorHeight = computed(() => {
    return {
      'height': 100 / floors.value + '%'
    }
  })
</script>

<template>
  <section>
    <div v-for="floor in floors" v-bind:key="floor" :style="floorHeight"></div>
  </section>
</template>

<style scoped lang="scss">
  section {
    height: 100%;

    div {
      border-bottom: 1px solid black;
    }
  }
</style>