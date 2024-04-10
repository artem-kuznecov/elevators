
/*
* Утилитарная функция
* По переданному селектору находит все эелементы и изменяет нужно свойство в style
*/
function changeStyleAll (selector: string, propName: string, newValue: string) {
  const elements: HTMLElement[] = [...document.querySelectorAll(selector)] as HTMLElement[]
  elements.forEach((element: HTMLSpanElement) => element.style[propName] = newValue)
}

/*
* Утилитарная функция
* По переданному селектору находит элемент и устанавливает атрибут с нужным значением
*/
function changeAttr (selector: string, propName: string, newValue: string) {
  document.querySelector(selector)?.setAttribute(propName, newValue)
}

export {
  changeStyleAll,
  changeAttr
}