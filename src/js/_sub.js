/*------------------------------
* 子要素に特定のクラスを持つ要素を返す
* @param {HTMLElement} parentEl 親要素
* @param {String} targetClass 特定したいクラス名
* @return {HTMLElement}
------------------------------*/
export function hasClass(parentEl, targetClass) {
  for (let i = 0; i < parentEl.children.length; i++) {
    if (parentEl.children[i].className.indexOf(targetClass) > -1) {
      return parentEl.children[i]
    }
  }
}

/*------------------------------
* 特定のクラスを削除する
* @param {HTMLElement} elArray 親要素
* @param {String} className 特定したいクラス名
------------------------------*/
export function removeClass(elArray, className) {
  for (let i = 0; i < elArray.length; i++) {
    if (elArray[i].classList.contains(className)) {
      elArray[i].classList.remove(className)
    }
  }
}

/*------------------------------
//クラスで取得した各要素にイベントを登録する
------------------------------*/
export function setEventEachEl(elArray, event, func) {
  for (let i = 0; i < elArray.length; i++) {
    elArray[i].addEventListener(event, func, false);
  }
}
