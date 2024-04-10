import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// * типы данных
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

  // * установка наблюдателя: если лифтов в движении меньше, чем всего лифтов - выполняется обработка очереди вызовов
  watch(queue, () => {
    if (processingCabins.value < shafts.value.length) processQueue()
    },
    { deep: true }
  )

  /*
    * функции увеличения и уменьшения количества этажей
  */

  function addFloors (): void {
    if (floors.value > FLOORS_LIMIT - 1) return
    const cabinElement: HTMLElement[] = [...document.querySelectorAll('.cabin')] as HTMLElement[]
    cabinElement.forEach((cabin: HTMLSpanElement) => cabin.style.transitionDuration = '0s')
    floors.value++
  }

  function reduceFloors (): void {
    if (floors.value < 3) return
    const cabinElement: HTMLElement[] = [...document.querySelectorAll('.cabin')] as HTMLElement[]
    cabinElement.forEach((cabin: HTMLSpanElement) => cabin.style.transitionDuration = '0s')
    floors.value--
  }

  /*
    * функции увеличения и уменьшения количества шахт лифта
  */

  function addShafts (): void {
    if (shafts.value.length > SHAFTS_LIMIT - 1) return
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
    * утилитарная функция "завершения" поездки лифта и его "простоя"
  */

  function finishProcess (prevSelected: number, cabinElement: HTMLElement, targetFloor: number) {
    setTimeout(() => {
      // * установка статуса "простоя" лифту
      shafts.value[prevSelected].cooldown = true
      cabinElement.setAttribute('cooldown', 'true')
      shafts.value[prevSelected].busy = false
      queue.value.shift()

      // * проверка, есть ли еще вызовы
      processingCabins.value--
      document.querySelector(`span.button[data-floor="${targetFloor}"]`)?.setAttribute('waiting', 'false')

      setTimeout(() => {
        shafts.value[prevSelected].cooldown = false
        cabinElement.setAttribute('cooldown', 'false')
        if (queue.value.length) return processQueue()
      }, 3000)

      if (queue.value.length) processQueue()
    }, Math.abs(shafts.value[prevSelected].currentFloor - targetFloor) * 1000)
  }

  /*
    * функции обработки очереди вызовов
  */

  function processQueue (): void {
    // * если нет активных вызовов
    if (!queue.value.length) return console.log('RETURN OUT')

    // * подсчет количества лифтов в работе - по сути, это количество выполняемых заказов
    const workingShafts = shafts.value.filter(shaft => shaft.busy)

    if (!queue.value[workingShafts.length]) return

    const targetFloor = queue.value[workingShafts.length].targetFloor

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

    finishProcess(selectedCabin, cabinElement, targetFloor)

    shafts.value[selectedCabin].currentFloor = targetFloor
  }

  function appendCall (targetFloor: number): void {
    // * проверка на наличие такого вызова в очереди
    const isInQueue = queue.value.some(call => call.targetFloor === targetFloor)
    // * проверка на наличие лифта на целевом этаже
    // const isOnTargetFloor = shafts.value.some(shaft => shaft.currentFloor === targetFloor)

    if (isInQueue) return

    document.querySelector(`span.button[data-floor="${targetFloor}"]`)?.setAttribute('waiting', 'true')
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