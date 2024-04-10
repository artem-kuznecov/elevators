// * сохранение состояния приложения при перезагрузке страницы
import { type IShaft, type TCall } from '@/stores/settings'

function storeData (floors: number, shafts: IShaft[], queue: TCall[]) {
  const initShafts = shafts.map(shaft => {
    return {
      ...shaft,
      busy: false,
      cooldown: false,
      isMovingUp: null,
      interimFloor: shaft.currentFloor
    }
  })
  const data = {
    floors,
    shafts: initShafts,
    queue
  }
  localStorage.removeItem('state')
  localStorage.setItem('state', JSON.stringify(data))
  return
}

function getDataFromLS () {
  const storedData = JSON.parse(localStorage.getItem('state') as string)
  return storedData
}

export { storeData, getDataFromLS }

