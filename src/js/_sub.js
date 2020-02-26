// module.exportを使ってhello関数を定義する。
export const hello = (message) => {
  console.log(`${message}を出力しました`);
};

export default class MerryGoRound {

  constructor(option) {
    this.elId = option.el;
    this.elIdStr = option.el.replace('#', '')
    this.wrapId = option.el + '_wrap'
    this.indicator = option.indicator;
    this.arrow = option.arrow;
    this.count = option.count > 0 ? option.count : 1;
    this.slideSpeed = option.slideSpeed;

    this.init();
  }

  init() {
    this.setSlideStyle()
    // インジケーターの設定
    this.setIndicator()
    // 矢印の設定
    this.setArrow()
    // スライダーの設定
    this.setSlider()
    // イベントハンドラーの登録
    this.setEventListener()
  }

  /*------------------------------
  * 子要素に特定のクラスを持つ要素を返す
  * @param {HTMLElement} parentEl 親要素
  * @param {String} targetClass 特定したいクラス名
  * @return {HTMLElement}
  ------------------------------*/
  hasClass(parentEl, targetClass) {
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
  removeClass(elArray, className) {
    for (let i = 0; i < elArray.length; i++) {
      if (elArray[i].classList.contains(className)) {
        elArray[i].classList.remove(className)
      }
    }
  }

  /*------------------------------
  * sliderの初期設定
  *
  ------------------------------*/
  setSlideStyle() {
    let list = document.querySelector(this.elId);
    list.classList.add('merry-slider')
    list.outerHTML = `<div id='${this.elIdStr}_wrap' class='merry-wrap'>${list.outerHTML}</div>`

    //共通としてクラス付与後にコンストラクタに渡す
    this.cont = document.querySelector(this.elId).parentElement
    this.slider = document.querySelector(this.elId)
    this.itemLen = this.slider.childElementCount
  }

  /*------------------------------
  * インジケーターの設定
  * option:indicator がfalseでない限り表示する
  ------------------------------*/
  setIndicator() {
    if (this.indicator != false) {
      //インジケーターの親要素を作成し追加する
      let newDotWrap = document.createElement('ul');
      newDotWrap.setAttribute('class', 'merry-indicator');
      this.cont.insertBefore(newDotWrap, this.slider.nextSibling)

      //slideのアイテム数ボタンを作成
      for (let i = 0; i < this.itemLen; i++) {
        let newDot = document.createElement('li');
        let newDotBtn = document.createElement('button');
        let newDotContent = document.createTextNode(i + 1); //テキストノードを作成
        newDotBtn.appendChild(newDotContent);
        newDot.appendChild(newDotBtn);
        newDot.setAttribute('class', 'merry-dot');
        newDot.setAttribute('data-dot', i + 1);
        let DotWrap = this.hasClass(this.cont, 'merry-indicator')
        DotWrap.appendChild(newDot);
      }
    }
  }

  /*------------------------------
  * 左右矢印の設定
  * option:arrow がfalseでない限り表示する
  ------------------------------*/
  setArrow() {
    if (this.arrow != false) {
      //左右矢印の親要素を作成する
      let newArrowWrap = document.createElement('ul');
      newArrowWrap.setAttribute('class', 'merry-arrowList');
      this.cont.insertBefore(newArrowWrap, document.getElementById(this.elId))

      //slideのアイテム数ボタンを作成
      for (let i = 0; i < 2; i++) {
        let newArrow = document.createElement('li');
        let newArrowBtn = document.createElement('button');
        let newArrowContent = document.createTextNode(i + 1);
        newArrowBtn.appendChild(newArrowContent);
        newArrow.appendChild(newArrowBtn);
        newArrow.setAttribute('class', 'merry-arrow');

        //ボタンに各々クラスを付与する
        if (i == 0) {
          newArrow.classList.add('merry-arrow-prev')
        } else {
          newArrow.classList.add('merry-arrow-next')
        }
        let ArrowWrap = this.hasClass(this.cont, 'merry-arrowList')
        ArrowWrap.appendChild(newArrow);
      }
    }
  }

  /*------------------------------
  * スライドする枚数の設定
  * countが指定してあればその枚数、指定がなければ1枚
  ------------------------------*/
  setSlider() {
    let slideItmes = this.slider.children;
    console.log(slideItmes)

    //各スライドに共通クラス、データ属性付与
    for (let i = 0; i < slideItmes.length; i++) {
      slideItmes[i].setAttribute('class', 'merry-slide')
      slideItmes[i].setAttribute('data-slide', i + 1);
    }

    TweenMax.set('.merry-slide', {
      width: 100 / this.count + '%'
    });

    //初期表示時にアクティブなスライドにクラス付与
    this.setActive(this.count - 1)
  }

  /*------------------------------
  * スライドする枚数の設定
  * countが指定してあればその枚数、指定がなければ1枚
  ------------------------------*/
  setEventListener() {
    let _this = this
    let indicatorBtn = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    let arrowBtn = document.querySelectorAll(`${this.wrapId} .merry-arrow`)

    //クラスで取得した各要素にイベントを登録する
    function setEventEachEl(elArray, event, func) {
      for (let i = 0; i < elArray.length; i++) {
        elArray[i].addEventListener(event, func, false);
      }
    }

    //インジケーターをクリックした時に実行
    function indicatorcClickEvent(e) {
      console.log('indicatorcClickEvent!')
      let clickBtn = e.target
      let clickBtnP = clickBtn.tagName == 'LI' ? clickBtn : clickBtn.parentElement
      let nextSlideNem = Number(clickBtnP.attributes['data-dot']["value"])
      _this.getActive()

      if (_this.currentActiveNum < nextSlideNem) { }
    }

    //左右矢印をクリックした時に実行
    function arrowClickEvent(e) {
      let clickBtn = e.target
      let clickBtnP = clickBtn.offsetParent
      _this.getActive()

      if (clickBtnP.className.indexOf('next') > -1) {
        //アクティブ状態の変更
        _this.setActive(_this.currentActiveNum + 1)
        //スライドアニメーション
        _this.doSlide('next')
      } else if (clickBtnP.className.indexOf('prev') > -1) {
        //アクティブ状態の変更
        _this.setActive(_this.currentActiveNum - 1)
        //スライドアニメーション
        _this.doSlide('prev')
      }
    }

    setEventEachEl(indicatorBtn, 'click', indicatorcClickEvent)
    setEventEachEl(arrowBtn, 'click', arrowClickEvent)

  }

  /*------------------------------
  * アクティブを付与する
  * @param {Number} activeNum
  ------------------------------*/
  setActive(activeNum) {
    let slideItmes = document.querySelectorAll(`${this.wrapId} .merry-slide`)
    let dotItems = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    this.removeActive()
    slideItmes[activeNum].classList.add('merry-slide-active')
    dotItems[activeNum].classList.add('merry-dot-active')
  }

  /*------------------------------
  * アクティブ要素の取得
  * @return {Number} currentActiveNum
  ------------------------------*/
  getActive() {
    let currentActiveSlide = document.querySelectorAll(`${this.wrapId} .merry-slide-active`)
    this.currentActiveNum = Number(currentActiveSlide[0].attributes["data-slide"]["value"]) - 1
    return this.currentActiveNum
  }

  /*------------------------------
  * アクティブ要素のリセット
  * @return {Number} currentActiveNum
  ------------------------------*/
  removeActive() {
    let slideItmes = document.querySelectorAll(`${this.wrapId} .merry-slide`)
    let dotItems = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    function removeClass(elArray, className) {
      for (let i = 0; i < elArray.length; i++) {
        if (elArray[i].classList.contains(className)) {
          elArray[i].classList.remove(className)
        }
      }
    }
    removeClass(slideItmes, 'merry-slide-active')
    removeClass(dotItems, 'merry-dot-active')
  }

  /*------------------------------
  * スライドアニメーション
  * @param {String} direction
  ------------------------------*/
  doSlide(direction) {
    let slideDirection
    let winW = document.body.clientWidth
    let sliderCurrentPos = document.querySelectorAll('#slider')[0].style.transform
    if (sliderCurrentPos == '') {
      sliderCurrentPos = 0
    } else {
      //trasnformXの値を取得
      sliderCurrentPos = Number(sliderCurrentPos.replace('matrix(', '').replace(')', '').split(',')[4])
    }

    console.log('sliderCurrentPos', sliderCurrentPos)
    console.log('this.currentActiveNum', this.currentActiveNum)

    if (direction == 'next') {
      slideDirection = sliderCurrentPos - this.count * winW
    } else if (direction == 'prev') {
      slideDirection = sliderCurrentPos + this.count * winW
    }
    TweenMax.to(this.elId, this.slideSpeed, {
      x: slideDirection
    });
  }
}
