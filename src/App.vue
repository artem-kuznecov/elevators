<script setup lang="ts">
  import { storeToRefs } from 'pinia'

  import FloorsGrid from '@/components/FloorsGrid.vue'
  import ShaftsGrid from '@/components/shafts/ShaftsGrid.vue'
  import { settingsStore } from '@/stores/settings'

  const FLOORS_LIMIT: number = Number(import.meta.env.SETTINGS_FLOORS_LIMIT)
  const SHAFTS_LIMIT: number = Number(import.meta.env.SETTINGS_SHAFTS_LIMIT)

  const settings = settingsStore()
  const { shafts, floors } = storeToRefs(settings)
  const { addFloors, reduceFloors, addShafts, reduceShafts } = settings
</script>

<template>
  <FloorsGrid />
  <ShaftsGrid />

  <span class="buttons-block">
    <button data-var="floors" :disabled="floors > FLOORS_LIMIT - 1" @click="addFloors()"><p>Добавить этаж</p></button>
    <button data-var="floors" :disabled="floors < 3" @click="reduceFloors()"><p>Убрать этаж</p></button>
    <button data-var="shafts" :disabled="shafts.length > SHAFTS_LIMIT - 1" @click="addShafts()"><p>Добавить шахту</p></button>
    <button data-var="shafts" :disabled="shafts.length < 2" @click="reduceShafts()"><p>Убрать шахту</p></button>
  </span>
</template>

<style lang="scss">
  .buttons-block {
    @extend .p-absolute, .flex;
    top: $gutter;
    right: $gutter;
    flex-direction: row;
    gap: $gutter * 2;
    z-index: 5;

    button {
      @extend .pointer;
      background: $gradient;
      outline: none;
      border: none;
      padding: $gutter;
      border-radius: $gutter / 2;
      box-shadow: $outter-sm-light;
      transition: $all-quick;

      &:active {
        transform: scale(0.9);
      }

      &:hover {
        box-shadow: $outter-sm;
      }

      &:disabled {
        background: $inactive;
        pointer-events: none;
      }

      p {
        color: #fff;
        font-size: $gutter * 2;
        user-select: none;
      }
    }
  }
</style>
