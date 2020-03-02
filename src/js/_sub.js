export default class MerryGoRound {

  constructor(option) {
    this.elId = option.el
    this.elIdStr = option.el.replace('#', '')
    this.wrapId = option.el + '_wrap'
    this.indicator = option.indicator
    this.arrow = option.arrow
    this.autoSlide = option.auto >= 0 ? option.auto : false
    this.count = option.count > 0 ? option.count : 1
    this.slideSpeed = option.slideSpeed

    this.init()
  }

  init() {
    //スライダーを横並びにする
    this.setSlideStyle()
    // インジケーターの設定
    this.setIndicator()
    // 矢印の設定
    this.setArrow()
    // スライダーの設定
    this.setSlider()
    // クリックイベントの登録
    this.setClickEventListener()
    // フリックイベントの登録
    this.setFlickEventListener()

    // 自動スライドの設定
    // option.autoに数字の指定があった場合、自動スライドする
    if (this.autoSlide > 0) {
      this.autoSlideAnimation()
      this.hoverAutoSlideAnimation()
    }
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

    //オリジナルの状態を複製しておく
    this.originalHtml = []
    for (let i = 0; i < this.itemLen; i++) {
      this.originalHtml[i] = this.slider.children[i].outerHTML
    }
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

    //各スライドに共通クラス、データ属性付与
    for (let i = 0; i < slideItmes.length; i++) {
      slideItmes[i].setAttribute('class', 'merry-slide')
      slideItmes[i].setAttribute('data-slide', i + 1);
    }

    //初期表示時にアクティブなスライドにクラス付与
    this.setActive(this.count)

    //最初と最後のスライドを無限ループ用に複製する
    let firstSlide = this.originalHtml[0]
    this.slider.insertAdjacentHTML('beforeend', firstSlide)
    this.slider.lastElementChild.classList.add('merry-slide-copy')
    this.slider.lastElementChild.style.width = 100 / this.count + '%'

    let lastSlide = this.originalHtml[this.itemLen - 1]
    this.slider.insertAdjacentHTML('afterbegin', lastSlide)
    this.slider.firstElementChild.classList.add('merry-slide-copy')
    this.slider.firstElementChild.style.width = 100 / this.count + '%'
    this.slider.firstElementChild.style.position = 'absolute'
    this.slider.firstElementChild.style.left = 100 / -this.count + '%'


    TweenMax.set('.merry-slide', {
      width: 100 / this.count + '%'
    });
  }

  /*------------------------------
  * クリックイベントの付与
  * 左右矢印とインジケーターにクリックイベントを付与する
  ------------------------------*/
  setClickEventListener() {
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
      let nextSlideNum = Number(clickBtnP.attributes['data-dot']["value"])

      //現在のカレント表示を取得
      _this.getCurrentActive()

      //アニメーション中だった場合現在のアニメーションを終了させる
      _this.skipAnimation()

      //自動でスライド中の場合のアニメーションを終了させてから
      //再自動スライド開始する
      if (_this.autoSlide > 0) {
        _this.stopAutoSlideAnimation()
      }

      if (_this.currentActiveNum < nextSlideNum) {
        let slideDistance = nextSlideNum - _this.currentActiveNum
        _this.setActive(nextSlideNum)
        _this.doSlide('next', slideDistance)
      } else if (_this.currentActiveNum > nextSlideNum) {
        let slideDistance = _this.currentActiveNum - nextSlideNum
        _this.setActive(nextSlideNum)
        _this.doSlide('prev', slideDistance)
      }
    }

    //左右矢印をクリックした時に実行
    function arrowClickEvent(e) {
      let clickBtn = e.target
      let clickBtnP = clickBtn.offsetParent

      //現在のカレント表示を取得
      _this.getCurrentActive()

      //アニメーション中だった場合現在のアニメーションを終了させる
      _this.skipAnimation()

      //自動でスライド中の場合のアニメーションを終了させてから
      //再自動スライド開始する
      if (_this.autoSlide > 0) {
        _this.stopAutoSlideAnimation()
      }

      if (clickBtnP.className.indexOf('next') > -1) {
        //次のスライドがある場合
        //無い場合ループするように見せかける処理
        if (_this.currentActiveNum < _this.itemLen) {
          _this.setActive(_this.currentActiveNum + 1)
          _this.doSlide('next', 1)
        } else {
          _this.doLoopAnmate('next')
        }
      } else if (clickBtnP.className.indexOf('prev') > -1) {
        //前のスライドがある場合
        //無い場合ループするように見せかける処理
        if (_this.currentActiveNum > 1) {
          _this.setActive(_this.currentActiveNum - 1)
          _this.doSlide('prev', 1)
        } else if (_this.currentActiveNum <= 1) {
          _this.doLoopAnmate('prev')
        }
      }
    }

    setEventEachEl(indicatorBtn, 'click', indicatorcClickEvent)
    setEventEachEl(arrowBtn, 'click', arrowClickEvent)

  }

  /*------------------------------
  * フリックイベントの付与
  * スライダー部分にフリックイベントを付与する
  ------------------------------*/
  setFlickEventListener() {
    let eventStartX, eventStartY, eventMoveX, eventMoveY
    let _this = this
    let flickFlag = false

    /*------------------------------
    * マウスダウン＆タッチスタート時の位置を取得
    ------------------------------*/
    this.slider.addEventListener('touchstart', eventStart, { passive: false })
    this.slider.addEventListener('mousedown', eventStart, { passive: false })

    function eventStart(event) {
      event.preventDefault()
      flickFlag = true
      if (event.touches == undefined) {
        eventStartX = event.pageX
        eventStartY = event.pageY
      } else {
        eventStartX = event.touches[0].pageX
        eventStartY = event.touches[0].pageY
      }
    }

    /*------------------------------
    * マウス＆タッチが移動した位置を取得
    ------------------------------*/
    this.slider.addEventListener('touchmove', eventMove, { passive: false })
    this.slider.addEventListener('mousemove', eventMove, { passive: false })

    function eventMove(event) {
      if (flickFlag) {
        event.preventDefault()
        if (event.touches == undefined) {
          eventMoveX = event.pageX
          eventMoveY = event.pageY
        } else {
          eventMoveX = event.changedTouches[0].pageX
          eventMoveY = event.changedTouches[0].pageY
        }
      }
    }

    /*------------------------------
    * マウス＆タッチが終了
    ------------------------------*/
    this.slider.addEventListener('touchend', eventEnd, { passive: false })
    this.slider.addEventListener('mouseup', eventEnd, { passive: false })

    function eventEnd() {
      _this.getCurrentActive()
      if (eventStartX > eventMoveX && eventStartX > (eventMoveX + 50)) {
        console.log('右から左にマウスが移動')
        if (_this.currentActiveNum < _this.itemLen) {
          _this.skipAnimation()
          _this.setActive(_this.currentActiveNum + 1)
          _this.doSlide('next', 1)
        } else {
          _this.skipAnimation()
          _this.doLoopAnmate('next')
        }
      } else if (eventStartX < eventMoveX && (eventStartX + 50) < eventMoveX) {
        console.log('左から右にマウスが移動')
        if (_this.currentActiveNum > 1) {
          _this.skipAnimation()
          _this.setActive(_this.currentActiveNum - 1)
          _this.doSlide('prev', 1)
        } else if (_this.currentActiveNum <= 1) {
          _this.skipAnimation()
          _this.doLoopAnmate('prev')
        }
      }

      flickFlag = false
    }
  }

  /*------------------------------
  * アクティブを付与する
  * @param {Number} activeNum
  ------------------------------*/
  setActive(activeNum) {
    let slideItmes = document.querySelectorAll(`${this.wrapId} .merry-slide`)
    let dotItems = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    //現在のactiveを削除
    this.removeActive()

    for (let i = 0; i < slideItmes.length; i++) {
      if (Number(slideItmes[i].attributes['data-slide']['value']) == activeNum) {
        slideItmes[i].classList.add('merry-slide-active')
      }

    }
    for (let i = 0; i < dotItems.length; i++) {
      if (Number(dotItems[i].attributes['data-dot']['value']) == activeNum) {
        dotItems[i].classList.add('merry-dot-active')
      }

    }
  }

  /*------------------------------
  * アクティブ要素の取得
  * @return {Number} currentActiveNum
  ------------------------------*/
  getCurrentActive() {
    let currentActiveSlide = document.querySelectorAll(`${this.wrapId} .merry-slide-active`)
    this.currentActiveNum = Number(currentActiveSlide[0].attributes['data-slide']['value'])
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
  doSlide(direction, count, callBack) {
    let slideDirection
    this.winW = document.body.clientWidth
    let sliderCurrentPos = document.querySelectorAll('#slider')[0].style.transform
    if (sliderCurrentPos == '') {
      sliderCurrentPos = 0
    } else {
      //trasnformXの値を取得
      sliderCurrentPos = Number(sliderCurrentPos.replace('matrix(', '').replace(')', '').split(',')[4])
    }

    if (direction == 'next') {
      //スライドする量 = 今のtransformX - スライドするスライドの枚数×(画面幅÷画面内に表示されているスライドの枚数)
      slideDirection = sliderCurrentPos - count * this.winW / this.count
    } else if (direction == 'prev') {
      slideDirection = sliderCurrentPos + count * this.winW / this.count
    }

    this.tween = TweenMax.to(this.elId, this.slideSpeed, {
      x: slideDirection,
      onComplete: callBack
    });
  }

  /*------------------------------
  * ループアニメーション
  * @param {String} direction
  ------------------------------*/
  doLoopAnmate(direction) {
    console.log('行き過ぎ')
    let _this = this

    function resetSlidePos() {
      let slidePos = direction == 'next' ? 0 : (_this.itemLen - 1) * -_this.winW / _this.count
      TweenMax.set(_this.elId, {
        x: slidePos,
        onComplete: function () {
        }
      })
    }

    if (direction == 'next') {
      this.doSlide('next', 1, resetSlidePos)
      _this.setActive(1)
    } else if (direction == 'prev') {
      this.doSlide('prev', 1, resetSlidePos)
      _this.setActive(_this.itemLen)
    }
  }

  /*------------------------------
  * アニメーション中断
  ------------------------------*/
  skipAnimation() {
    if (TweenMax.isTweening(this.elId) == true) {
      this.tween.seek(this.slideSpeed)
      console.log('アニメーションすっ飛ばし')
    }
  }

  /*------------------------------
  * 自動アニメーション
  ------------------------------*/
  autoSlideAnimation() {
    let _this = this
    let timeOut = this.autoSlide * 1000 + this.slideSpeed * 1000

    this.setIntervalId = setInterval(() => {
      _this.getCurrentActive()
      //次のスライドがある場合
      //無い場合ループするように見せかける処理
      if (_this.currentActiveNum < _this.itemLen) {
        _this.setActive(_this.currentActiveNum + 1)
        _this.doSlide('next', 1)
      } else {
        _this.doLoopAnmate('next')
      }
    }, timeOut);
  }

  /*------------------------------
  * 自動アニメーション中止
  ------------------------------*/
  stopAutoSlideAnimation() {
    if (this.setIntervalId != null) {
      clearInterval(this.setIntervalId)
      this.setIntervalId = null
    }
  }

  /*------------------------------
  * ホバーで自動アニメーションを止める
  ------------------------------*/
  hoverAutoSlideAnimation() {
    let _this = this
    this.cont.addEventListener('mouseenter', setHoverEvent, { passive: false })
    this.cont.addEventListener('mouseleave', clearHoverEvent, { passive: false })

    function setHoverEvent() {
      console.log('setHoverEvent')
      _this.stopAutoSlideAnimation()
    }
    function clearHoverEvent() {
      console.log('clearHoverEvent')
      _this.autoSlideAnimation()
    }
  }
}
