import { defineStore } from 'pinia'
import { ref } from 'vue'

export const settingsStore = defineStore('settings', () => {
  // * количество этажей
  const floors = ref(1)
  // * количество шахт лифта
  const shafts = ref(1)

  /*
    * функции увеличения и уменьшения количества этажей
    * ПРИМЕЧАНИЕ: по умолчанию задано ограничение в 8 этажей
  */

  function addFloors (): void {
    if (floors.value > 7) return
    floors.value++
  }

  function reduceFloors (): void {
    if (floors.value < 2) return
    floors.value--
  }

  return {
    floors,
    shafts,
    addFloors,
    reduceFloors
  }
})