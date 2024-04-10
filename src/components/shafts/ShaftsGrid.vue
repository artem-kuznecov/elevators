<script lang='ts' setup>
  import { storeToRefs } from 'pinia'

  import Shaft from '@/components/shafts/Shaft.vue'
  import { settingsStore } from '@/stores/settings'

  const settings = settingsStore()

  const { shafts } = storeToRefs(settings)
</script>

<template>
  <div class="shafts-grid">
    <Shaft
      v-for="shaft in shafts"
      v-bind:key="shaft.id + '_shaft'"
      :style="{'left': 3 + (shaft.id - 1) * (6 + 8)  + 'rem'}"
      :shaft="shaft"
    />
  </div>
</template>

<style scoped lang="scss">
  .shafts-grid {
    @extend .p-absolute;
    top: 0;
    left: 3rem;
    height: 100%;
    z-index: 2;
  }
</style>