<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'

  import { settingsStore } from '@/stores/settings'

  const settings = settingsStore()
  const { floors } = storeToRefs(settings)
  const { appendCall } = settings

  const floorHeight = computed(() => {
    return {
      'height': 100 / floors.value + '%'
    }
  })

  const callHandler = (targetFloor: number) => {
    appendCall(targetFloor)
  }
</script>

<template>
  <section>
    <div
      v-for="floor in floors"
      v-bind:key="floor + '_floor'"
      class="floor"
      :style="floorHeight"
    >
      <span class="floor-tile">
        <span class="button" :data-floor="floors - floor + 1" @click="callHandler(floors - floor + 1)">
          <p>{{ floors - floor + 1 }}</p>
        </span>
      </span>
    </div>
  </section>
</template>

<style scoped lang="scss">
  section {
    height: 100%;

    .floor {
      padding: $gutter;
      border-bottom: 1px solid $light;

      .floor-tile {
        @extend .p-fixed;
        left: $gutter * 2;
        z-index: 5;
        font-size: $gutter * 3;

        .button {
          @extend .flex, .center-full, .rounded-full, .pointer;
          height: $gutter * 4;
          width: $gutter * 4;
          background-color: $light;
          box-shadow: $outter-sm;
          transition: $all-quick;

          &:active {
            transform: scale(0.9);
          }

          &[waiting='true'] {
            background-color: $active;
            box-shadow: $outter-sm-green;
          }

          p {
            pointer-events: none;
          }
        }
      }
    }
  }
</style>