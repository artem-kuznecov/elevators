<script lang='ts' setup>
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

<style scoped>
  .shaft {
    position: absolute;
    background-color: #d9d9d9;
    box-shadow: inset 0px 0 10px black;
    height: 100%;
    width: 10rem;

    .cabin {
      position: relative;
      top: 0;
      display: flex;
      justify-content: center;
      background-color: #d3d3d3;
      box-shadow: inset 0 0 25px black;
      padding-top: 8px;

      transition: top 1s linear;

      .table {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
        width: 50%;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.7);
      }

      &[cooldown='true'] {
        animation: pulsing 1s infinite;
      }
    }
  }

  @keyframes pulsing {
    0% {
      box-shadow: inset 0 0 25px black;
    }
    50% {
      box-shadow: inset 0 10px 100px black;
    }
    100% {
      box-shadow: inset 0 0 25px black;
    }
  }
</style>