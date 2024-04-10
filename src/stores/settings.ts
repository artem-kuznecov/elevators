import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface IShaft {
  id: number,
  currentFloor: number,
  busy: boolean,
  cooldown: boolean
}

type TCall = {
  targetFloor: number
}

// * получение и определение изначальных значений
const FLOORS_LIMIT: number = Number(import.meta.env.SETTINGS_FLOORS_LIMIT)
const SHAFTS_LIMIT: number = Number(import.meta.env.SETTINGS_SHAFTS_LIMIT)
const DEFAULT_FLOORS: number = Number(import.meta.env.SETTINGS_FLOORS) > FLOORS_LIMIT ? FLOORS_LIMIT : Number(import.meta.env.SETTINGS_FLOORS)
const DEFAULT_SHAFTS: number = Number(import.meta.env.SETTINGS_SHAFTS) > SHAFTS_LIMIT ? SHAFTS_LIMIT : Number(import.meta.env.SETTINGS_SHAFTS)

export const settingsStore = defineStore('settings', () => {
  // * очередь вызовов
  const queue = ref<TCall[]>([])

  // * статус обработки вызовов
  const isProcessing = ref(false)

  // * количество кабин в движении
  const processingCabins = ref(0)

  // * количество этажей
  const floors = ref(DEFAULT_FLOORS)

  watch(queue, () => {if (processingCabins.value < shafts.value.length) processQueue(); console.log('changed')}, { deep: true })

  // * количество шахт лифта
  const initialShafts = []
  for (let i = 0; i < DEFAULT_SHAFTS; i++) {
    initialShafts.push(
      {
        id: i + 1,
        currentFloor: 1,
        busy: false,
        cooldown: false
      }
    )
  }
  const shafts = ref(initialShafts)

  /*
    * функции увеличения и уменьшения количества этажей
    * ПРИМЕЧАНИЕ: по умолчанию задано ограничение в 8 этажей
  */

  function addFloors (): void {
    if (floors.value > 7) return
    floors.value++
  }

  function reduceFloors (): void {
    if (floors.value < 3) return
    floors.value--
  }

  /*
    * функции увеличения и уменьшения количества шахт лифта
    * ПРИМЕЧАНИЕ: по умолчанию задано ограничение в 6 шахт
  */

  function addShafts (): void {
    if (shafts.value.length > 5) return
    const newID = shafts.value[shafts.value.length - 1].id + 1
    shafts.value.push({
      id: newID,
      currentFloor: 1,
      busy: false,
      cooldown: false
    })
  }

  function reduceShafts (): void {
    if (shafts.value.length < 2) return
    shafts.value.pop()
  }

  /*
    * функции обработки очереди вызовов
  */

  function processQueue (): void {
    // * если нет активных вызовов
    if (!queue.value.length) return

    // * подсчет количества лифтов в работе - по сути, это количество выполняемых заказов
    const workingShafts = shafts.value.filter(shaft => shaft.busy)

    const targetFloor = queue.value[workingShafts.length].targetFloor

    // * если на целевом этаже уже есть лифт - выход из функции
    if (shafts.value.some(shaft => shaft.currentFloor === targetFloor)) return

    // * нахождение ближайшего к целевому этажу лифта и перевод его в статус "занят"
    // * фильтрация только незанятых и простаивающих лифтов
    const availableCabins = shafts.value.filter(shaft => !shaft.busy && !shaft.cooldown)

    if (!availableCabins.length) return
    processingCabins.value ++

    const closestCabin =
      availableCabins.reduce((prev, curr) =>
        Math.abs(prev.currentFloor - targetFloor) < Math.abs(curr.currentFloor - targetFloor)
        ?
        prev : curr
      )

    const selectedCabinElement = shafts.value.find(shaft => shaft.id === closestCabin.id) as IShaft
    const selectedCabin = shafts.value.indexOf(selectedCabinElement)

    shafts.value[selectedCabin].busy = true

    // * добавление анимации нужной продолжительности
    const cabinElement = document.querySelector(`.cabin[data-order="${shafts.value[selectedCabin].id}"]`) as HTMLElement
    cabinElement.style.transitionDuration = Math.abs(shafts.value[selectedCabin].currentFloor - targetFloor) + 's'

    setTimeout(() => {
      // * установка статуса "простоя" лифту
      shafts.value[selectedCabin].cooldown = true
      cabinElement.setAttribute('cooldown', 'true')
      shafts.value[selectedCabin].busy = false
      queue.value.shift()

      // * проверка, есть ли еще вызовы
      processingCabins.value--
      document.querySelector(`[data-floor="${targetFloor}"]`)?.setAttribute('waiting', 'false')
      if (queue.value.length) processQueue()

      setTimeout(() => {
        shafts.value[selectedCabin].cooldown = false
        cabinElement.setAttribute('cooldown', 'false')
        if (queue.value.length) return processQueue()
      }, 3000)

    }, Math.abs(shafts.value[selectedCabin].currentFloor - targetFloor) * 1000)

    shafts.value[selectedCabin].currentFloor = targetFloor
  }

  function appendCall (targetFloor: number): void {
    // * проверка на наличие такого вызова в очереди
    const isInQueue = queue.value.some(call => call.targetFloor === targetFloor)
    if (isInQueue) return

    queue.value.push({ targetFloor })
  }

  return {
    floors,
    shafts,
    addFloors,
    reduceFloors,
    addShafts,
    reduceShafts,
    appendCall,
    processQueue,
    isProcessing,
    processingCabins
  }
})