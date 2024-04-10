import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { changeAttr, changeStyleAll } from '@/utils/changeStyles'

// * типы данных
interface IShaft {
  id: number,
  currentFloor: number,
  busy: boolean,
  cooldown: boolean,
  isMovingUp: boolean | null ,
  interimFloor: number
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

  // * количество кабин в движении
  const processingCabins = ref(0)

  // * количество этажей
  const floors = ref(DEFAULT_FLOORS)

  // * количество шахт лифта
  const initialShafts: IShaft[] = []
  for (let i = 0; i < DEFAULT_SHAFTS; i++) {
    initialShafts.push(
      {
        id: i + 1,
        currentFloor: 1,
        busy: false,
        cooldown: false,
        isMovingUp: null,
        interimFloor: 1
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
    changeStyleAll('.cabin', 'transitionDuration', '0s')
    floors.value++
  }

  function reduceFloors (): void {
    if (floors.value < 3) return
    changeStyleAll('.cabin', 'transitionDuration', '0s')
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
      cooldown: false,
      isMovingUp: null,
      interimFloor: 1
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
    // * если все вызовы уже обрабатываются
    if (!queue.value[workingShafts.length]) return

    const targetFloor = queue.value[workingShafts.length].targetFloor

    // * фильтрация только незанятых и не простаивающих лифтов
    const availableCabins = shafts.value.filter(shaft => !shaft.busy && !shaft.cooldown)
    if (!availableCabins.length) return

    processingCabins.value ++

    // * нахождение ближайшего к целевому этажу лифта и перевод его в статус "занят"
    const closestCabin =
      availableCabins.reduce((prev, curr) =>
        Math.abs(prev.currentFloor - targetFloor) < Math.abs(curr.currentFloor - targetFloor)
        ?
        prev : curr
      )
    const selectedCabinElement = shafts.value.find(shaft => shaft.id === closestCabin.id) as IShaft
    const selectedCabin = shafts.value.indexOf(selectedCabinElement)
    shafts.value[selectedCabin].busy = true

    // * установка селекторов для кнопки целевого этажа и выбранной кабины лифты
    const buttonSelector = `span.button[data-floor="${targetFloor}"]`
    const cabinSelector = `.cabin[data-order="${shafts.value[selectedCabin].id}"]`

    // * установка направления движения
    if (shafts.value[selectedCabin].currentFloor < targetFloor) shafts.value[selectedCabin].isMovingUp = true
    else shafts.value[selectedCabin].isMovingUp = false

    // * добавление анимации движения нужной продолжительности
    changeStyleAll(cabinSelector, 'transitionDuration', Math.abs(shafts.value[selectedCabin].currentFloor - targetFloor) + 's')

    // * установка интервала смены номера этажа на табло кабины
    const inter = setInterval(() => {
      if (shafts.value[selectedCabin].isMovingUp === true) shafts.value[selectedCabin].interimFloor++
      else shafts.value[selectedCabin].interimFloor--
      if (shafts.value[selectedCabin].interimFloor === targetFloor) {
        clearInterval(inter)
        shafts.value[selectedCabin].isMovingUp = null
      }
    }, 1000)

    setTimeout(() => {
      // * установка статуса "простоя" лифту
      shafts.value[selectedCabin].cooldown = true
      changeAttr(cabinSelector, 'cooldown', 'true')
      // * установка всех необходимых параметров для "простаивающего" лифта
      shafts.value[selectedCabin].busy = false
      queue.value.shift()
      processingCabins.value--
      changeAttr(buttonSelector, 'waiting', 'false')

      setTimeout(() => {
        shafts.value[selectedCabin].cooldown = false
        changeAttr(cabinSelector, 'cooldown', 'false')
        // * если есть еще вызовы - переход к обработке
        if (queue.value.length) return processQueue()
      }, 3000)

    }, Math.abs(shafts.value[selectedCabin].currentFloor - targetFloor) * 1000)

    shafts.value[selectedCabin].currentFloor = targetFloor
  }

  function appendCall (targetFloor: number): void {
    const buttonSelector = `span.button[data-floor="${targetFloor}"]`
    // * проверка на наличие такого вызова в очереди
    const isInQueue = queue.value.some(call => call.targetFloor === targetFloor)
    // * проверка на наличие лифта на целевом этаже
    const isOnTargetFloor = shafts.value.some(shaft => shaft.currentFloor === targetFloor)

    if (isInQueue || isOnTargetFloor) return

    changeAttr(buttonSelector, 'waiting', 'true')
    queue.value.push({ targetFloor })
  }

  return {
    floors,
    shafts,
    addFloors,
    reduceFloors,
    addShafts,
    reduceShafts,
    appendCall
  }
})