<script setup lang="ts">
  const FLOORS_LIMIT: number = Number(import.meta.env.SETTINGS_FLOORS_LIMIT)
  const SHAFTS_LIMIT: number = Number(import.meta.env.SETTINGS_SHAFTS_LIMIT)

  import FloorsGrid from '@/components/FloorsGrid.vue'
  import ShaftsGrid from '@/components/shafts/ShaftsGrid.vue'
  import { settingsStore } from '@/stores/settings'
  import { storeToRefs } from 'pinia'

  const settings = settingsStore()
  const { shafts, floors } = storeToRefs(settings)
  const { addFloors, reduceFloors, addShafts, reduceShafts } = settings

</script>

<template>
  <FloorsGrid />
  <ShaftsGrid />

  <span class="buttons-block">
    <button data-var="floors" :disabled="floors > FLOORS_LIMIT" @click="addFloors()"><p>Добавить этаж</p></button>
    <button data-var="floors" :disabled="floors < 3" @click="reduceFloors()"><p>Убрать этаж</p></button>
    <button data-var="shafts" :disabled="shafts.length > SHAFTS_LIMIT" @click="addShafts()"><p>Добавить шахту</p></button>
    <button data-var="shafts" :disabled="shafts.length < 2" @click="reduceShafts()"><p>Убрать шахту</p></button>
  </span>
</template>

<style lang="scss">
  .buttons-block {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    flex-direction: row;
    gap: 12px;
    z-index: 5;

    button {
      background: linear-gradient(190.32deg, #9F40CC 5.37%, #F6C444 97.53%);
      outline: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(27, 27, 27, 0.7);
      cursor: pointer;
      transition: all 0.2s;

      &:active {
        transform: scale(0.9);
      }

      &:hover {
        box-shadow: 0 0 12px rgba(27, 27, 27, 1);
      }

      &:disabled {
        background: grey;
        pointer-events: none;
      }

      p {
        color: #fff;
        font-size: 16px;
        user-select: none;
      }
    }
  }
</style>
