<script lang='ts' setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'

  import { settingsStore } from '@/stores/settings'

  const props = defineProps({
    currentFloor: Number,
    dataOrder: Number
  })

  const settings = settingsStore()
  const { floors } = storeToRefs(settings)

  const cabinSizing = computed(() => {
    const height = Number(100 / floors.value) / 100 * window.innerHeight
    return { height }
  })
</script>

<template>
  <span class="shaft">
    <div
      class="cabin"
      :data-order="dataOrder"
      :style="{
        'height': cabinSizing.height + 'px',
        'top': (floors - Number(props.currentFloor)) * cabinSizing.height + 'px'
      }"
    ></div>
  </span>
</template>

<style scoped>
  .shaft {
    position: absolute;
    background-color: lightgreen;
    height: 100%;
    width: 10rem;

    .cabin {
      position: relative;
      top: 0;
      background-color: red;
      transition: top 1s linear;

      &[cooldown='true'] {
        background-color: grey;
      }
    }
  }
</style>