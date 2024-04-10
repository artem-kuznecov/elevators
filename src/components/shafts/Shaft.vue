<script setup lang='ts'>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'

  import { settingsStore } from '@/stores/settings'

  const props = defineProps({
    shaft: Object
  })

  const settings = settingsStore()
  const { floors } = storeToRefs(settings)

  const cabinSizing = computed(() => {
    const height = Number(100 / floors.value) / 100 * window.innerHeight
    return { height }
  })

  const tableSign = computed(() => {
    if (props.shaft?.isMovingUp === null) return
    return props.shaft?.isMovingUp ? 'UP': 'DOWN'
  })
</script>

<template>
  <span class="shaft">
    <div
      class="cabin"
      :data-order="shaft?.id"
      :style="{
        'height': cabinSizing.height + 'px',
        'top': (floors - Number(props.shaft?.currentFloor)) * cabinSizing.height + 'px'
      }"
    >
      <span class="table">
        <p>{{ shaft?.interimFloor }} {{ tableSign }}</p>
      </span>
    </div>
  </span>
</template>

<style scoped lang="scss">
  .shaft {
    @extend .p-absolute;
    height: 100%;
    width: 10rem;
    background-color: $grey;
    box-shadow: $inner-sm;

    .cabin {
      @extend .p-relative, .flex, .center-x;
      top: 0;
      padding-top: $gutter;
      background-color: $light;
      box-shadow: $inner-md;
      transition: $all-long;

      .table {
        @extend .flex, .center-full;
        height: $gutter * 3;
        width: 50%;
        border-radius: $gutter / 2;
        background-color: $light;
        box-shadow: $outter-sm-light;
      }

      &[cooldown='true'] {
        animation: pulsing 1s infinite;
      }
    }
  }
</style>