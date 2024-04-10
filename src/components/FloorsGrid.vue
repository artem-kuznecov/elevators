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
    document.querySelector(`[data-floor="${targetFloor}"]`)?.setAttribute('waiting', 'true')
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
      <span class="p">
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
      border-bottom: 1px solid black;

      .p {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        position: fixed;
        font-size: $font-large;
        z-index: 5;

        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #D9D9D9;
          border-radius: 50vw;
          width: 36px;
          height: 36px;
          aspect-ratio: 1 / 1;
          box-shadow: 0 0 10px rgba(27, 27, 27, 0.7);
          cursor: pointer;
          transition: all 0.2s;

          &:active {
            transform: scale(0.9);
          }

          &[waiting='true'] {
            background-color: rgb(144, 238, 144);
          }

          p {
            pointer-events: none;
          }
        }
      }

      button {
        position: relative;
        top: 50px;
      }

      svg {
        // position: absolute;
        // top: 0;
        // left: 0;
      }
    }
  }
</style>