/*------------------------------
* 子要素に特定のクラスを持つ要素を返す
* @param {HTMLElement} parentEl 親要素
* @param {String} targetClass 特定したいクラス名
* @return {HTMLElement}
------------------------------*/
function hasClass(parentEl, targetClass) {
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
function removeClass(elArray, className) {
  for (let i = 0; i < elArray.length; i++) {
    if (elArray[i].classList.contains(className)) {
      elArray[i].classList.remove(className)
    }
  }
}

/*------------------------------
//クラスで取得した各要素にイベントを登録する
------------------------------*/
function setEventEachEl(elArray, event, func) {
  for (let i = 0; i < elArray.length; i++) {
    elArray[i].addEventListener(event, func, false);
  }
}

class MerryGoRound {

  constructor() {
    this.cont = null
    this.slider = null
    this.itemLen = 0
    this.originalHtml = []
    this.winW = 0
    this.setIntervalId = null
  }

  merry(option) {
    this.elId = option.el
    this.elIdStr = option.el.replace('#', '')
    this.wrapId = option.el + '_wrap'
    this.indicator = option.indicator
    this.arrow = option.arrow
    this.count = option.count > 0 ? option.count : 1
    this.slideSpeed = option.slideSpeed
    this.autoSlide = option.autoSlide >= 0 ? option.autoSlide : false
    this.endFunc = typeof option.endFunc === 'function' ? option.endFunc : false
    this.fadeFlag = option.fade == true ? true : false
    this.fadeSpeed = option.fadeSpeed
    this.autoFade = option.autoFade >= 0 ? option.autoFade : false

    this.slideType =
      option.fade == true ? 'fade'
        : 'slide'

    this.init()
  }

  init() {
    this.resize()
    //スライダーを横並びにする
    this.setInitStyle()
    // インジケーターの設定
    this.addIndicator()
    // 矢印の設定
    this.setArrow()


    if (this.slideType == 'slide') {
      this.slide()
    }
    if (this.slideType == 'fade') {
      this.fade()
    }
    console.log('slidetype:', this.slideType)
  }

  /*------------------------------
  * slideアニメーションのセット
  ------------------------------*/
  slide() {
    // スライダーの設定
    this.setSlideSlider()
    //初期表示時にアクティブなスライドにクラス付与
    this.setActive(this.count)
    // クリックイベントの登録
    this.setClickEvent()
    // フリックイベントの登録
    this.setFlickEvent()

    // 自動スライドの設定
    // option.autoに数字の指定があった場合、自動スライドする
    if (this.autoSlide > 0) {
      this.autoAnimate()
      this.setHoverEventAutoAnimation()
    }
  }

  /*------------------------------
  * fadeアニメーションのセット
  ------------------------------*/
  fade() {
    //初期表示時にアクティブなスライドにクラス付与
    this.setActive(this.count)

    // スライダーの設定
    this.setFadeSlider()
    // クリックイベントの登録
    this.setFadeClickEvent()

    // 自動スライドの設定
    // option.autoに数字の指定があった場合、自動スライドする
    if (this.autoFade > 0) {
      this.autoAnimate()
      this.setHoverEventAutoAnimation()
    }

  }

  /*------------------------------
  * sliderの初期設定
  ------------------------------*/
  setInitStyle() {
    let list = document.querySelector(this.elId);
    list.classList.add('merry-slider')
    list.outerHTML = `<div id='${this.elIdStr}_wrap' class='merry-wrap'>${list.outerHTML}</div>`

    //共通としてクラス付与後にコンストラクタに渡す
    this.cont = document.querySelector(this.elId).parentElement
    this.slider = document.querySelector(this.elId)
    this.itemLen = this.slider.childElementCount

    //オリジナルの状態を複製しておく
    for (let i = 0; i < this.itemLen; i++) {
      this.originalHtml[i] = this.slider.children[i].outerHTML
    }

    let slideItmes = this.slider.children;

    //各スライドに共通クラス、データ属性付与
    for (let i = 0; i < slideItmes.length; i++) {
      slideItmes[i].setAttribute('class', 'merry-slide')
      slideItmes[i].setAttribute('data-slide', i + 1)
      let slide = document.querySelectorAll(`${this.wrapId} .merry-slide`)[i]
      TweenMax.set(slide, {
        width: 100 / this.count + '%'
      });
    }
    this.winW = document.body.clientWidth
  }

  /*------------------------------
  * インジケーターの設定
  * option:indicator がfalseでない限り表示する
  ------------------------------*/
  addIndicator() {
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
        let DotWrap = hasClass(this.cont, 'merry-indicator')
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
        let ArrowWrap = hasClass(this.cont, 'merry-arrowList')
        ArrowWrap.appendChild(newArrow);
      }
    }
  }

  /*------------------------------
  * スライドする枚数の設定
  * countが指定してあればその枚数、指定がなければ1枚
  ------------------------------*/
  setSlideSlider() {
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
  }

  /*------------------------------
  * クリックイベントの付与
  * 左右矢印とインジケーターにクリックイベントを付与する
  ------------------------------*/
  setClickEvent() {
    let _this = this
    let indicatorBtn = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    let arrowBtn = document.querySelectorAll(`${this.wrapId} .merry-arrow`)

    //インジケーターをクリックした時に実行
    function indicatorClickEvent(e) {
      console.log('indicatorClickEvent!')
      let clickBtn = e.target
      let clickBtnP = clickBtn.tagName == 'LI' ? clickBtn : clickBtn.parentElement
      let nextSlideNum = Number(clickBtnP.attributes['data-dot']["value"])

      //アニメーション中だった場合現在のアニメーションを終了させる
      _this.skipSlideAnimate()

      //自動でスライド中の場合のアニメーションを終了させてから
      //再自動スライド開始する
      if (_this.autoSlide > 0) {
        _this.stopAutoAnimate()
      }
      //現在のカレント表示を取得
      _this.getCurrentActive()

      if (_this.currentActiveNum < nextSlideNum) {
        let slideDistance = nextSlideNum - _this.currentActiveNum
        _this.setActive(nextSlideNum)
        _this.doSlideAnimate('next', slideDistance, _this.endFunc)
      } else if (_this.currentActiveNum > nextSlideNum) {
        let slideDistance = _this.currentActiveNum - nextSlideNum
        _this.setActive(nextSlideNum)
        _this.doSlideAnimate('prev', slideDistance, _this.endFunc)
      }
    }

    //左右矢印をクリックした時に実行
    function arrowClickEvent(e) {
      console.log('左右矢印をクリック!')
      let clickBtn = e.target
      let clickBtnP = clickBtn.offsetParent

      //アニメーション中だった場合現在のアニメーションを終了させる
      _this.skipSlideAnimate()

      //自動でスライド中の場合のアニメーションを終了させてから
      //再自動スライド開始する
      if (_this.autoSlide > 0) {
        _this.stopAutoAnimate()
      }
      //現在のカレント表示を取得
      _this.getCurrentActive()

      if (clickBtnP.className.indexOf('next') > -1) {
        //次のスライドがある場合
        if (_this.currentActiveNum <= _this.itemLen) {
          _this.setActive(_this.currentActiveNum + 1)
          _this.doSlideAnimate('next', 1, _this.endFunc)
          //無い場合、一番最初に戻る
        } else {
          console.log('次のスライド無')
          _this.setActive(1)
          _this.doSlideAnimate('next', 1, _this.endFunc)
        }

      } else if (clickBtnP.className.indexOf('prev') > -1) {
        //前のスライドがある場合
        if (_this.currentActiveNum > 1) {
          _this.setActive(_this.currentActiveNum - 1)
          _this.doSlideAnimate('prev', 1, _this.endFunc)

          //無い場合ループするように見せかける処理
        } else if (_this.currentActiveNum <= 1) {
          console.log('次のスライド無')
          _this.setActive(_this.itemLen)
          _this.doSlideAnimate('prev', 1, _this.endFunc)
        }
      }
    }

    setEventEachEl(indicatorBtn, 'click', indicatorClickEvent)
    setEventEachEl(arrowBtn, 'click', arrowClickEvent)

  }

  /*------------------------------
  * フリックイベントの付与
  * スライダー部分にフリックイベントを付与する
  ------------------------------*/
  setFlickEvent() {
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
      //アニメーション中だった場合現在のアニメーションを終了させる
      _this.skipSlideAnimate()
      //自動でスライド中の場合のアニメーションを終了させてから
      //再自動スライド開始する
      if (_this.autoSlide > 0) {
        _this.stopAutoAnimate()
      }
      //現在のカレント表示を取得
      _this.getCurrentActive()
      if (eventStartX > eventMoveX && eventStartX > (eventMoveX + 50)) {
        //右から左にマウスが移動
        if (_this.currentActiveNum <= _this.itemLen) {
          _this.setActive(_this.currentActiveNum + 1)
          _this.doSlideAnimate('next', 1, _this.endFunc)
        } else {
          console.log('次のスライド無')
          _this.setActive(1)
          _this.doSlideAnimate('next', 1, _this.endFunc)
        }
      } else if (eventStartX < eventMoveX && (eventStartX + 50) < eventMoveX) {
        //左から右にマウスが移動
        if (_this.currentActiveNum > 1) {
          _this.setActive(_this.currentActiveNum - 1)
          _this.doSlideAnimate('prev', 1, _this.endFunc)
        } else if (_this.currentActiveNum <= 1) {
          console.log('次のスライド無')
          _this.setActive(_this.itemLen)
          _this.doSlideAnimate('prev', 1, _this.endFunc)
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
    //trasnformXの値を取得
    let sliderCurrentPos

    if (document.querySelectorAll(this.elId)[0].style.transform == '') {
      sliderCurrentPos = 0
      this.currentActiveNum = 1
    } else {
      let sliderTransform = document.querySelectorAll(this.elId)[0].style.transform
      sliderCurrentPos = Number(sliderTransform.replace('matrix(', '').replace(')', '').split(',')[4])
      this.currentActiveNum = Math.abs(sliderCurrentPos) / this.winW + 1
    }

    console.log(this.currentActiveNum)
    return this.currentActiveNum
  }

  /*------------------------------
  * アクティブ要素のリセット
  * @return {Number} currentActiveNum
  ------------------------------*/
  removeActive() {
    let slideItmes = document.querySelectorAll(`${this.wrapId} .merry-slide`)
    let dotItems = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    removeClass(slideItmes, 'merry-slide-active')
    removeClass(dotItems, 'merry-dot-active')
  }

  /*------------------------------
  * スライドアニメーション
  * @param {String} direction
  * @param {Function} callBack
  ------------------------------*/
  doSlideAnimate(direction, count, callBack) {
    let _this = this
    let loopFlag = false
    let sliderCurrentPos = document.querySelectorAll(this.elId)[0].style.transform
    let slideDirection

    if (sliderCurrentPos == '') {
      sliderCurrentPos = 0
    } else {
      //trasnformXの値を取得
      sliderCurrentPos = Number(sliderCurrentPos.replace('matrix(', '').replace(')', '').split(',')[4])
    }

    if (direction == 'next') {
      //スライドする量 = 今のtransformX - スライドするスライドの枚数×(画面幅÷画面内に表示されているスライドの枚数)
      slideDirection = sliderCurrentPos - count * this.winW / this.count

      //現在の位置が一番最後のスライドがスライドした状態だった場合
      //つまり、一番後ろに複製されいてるスライドが表示されている状態の場合
      //最初の位置に戻してから二枚目分スライドする
      if (Math.abs(sliderCurrentPos) == (count * this.winW / this.count) * this.itemLen) {
        console.log(sliderCurrentPos)
        TweenMax.set(_this.elId, {
          x: 0,
        })
        slideDirection = -(count * this.winW / this.count) * 1
        _this.setActive(2)
      }

      //次のスライド量が最後のスライド表示時より大きい場合
      //一枚目に戻るような見せかけ処理を行う
      if (Math.abs(slideDirection) / (count * this.winW / this.count) >= this.itemLen) {
        console.log('ループ')
        loopFlag = true
        _this.setActive(1)
      }
    } else if (direction == 'prev') {
      //スライドする量 = 今のtransformX + スライドするスライドの枚数×(画面幅÷画面内に表示されているスライドの枚数)
      slideDirection = sliderCurrentPos + count * this.winW / this.count

      //現在の位置が一番最初のスライドがスライドした状態だった場合
      //つまり、一番初に複製されいてるスライドが表示されている状態の場合
      //複製されいてる最後のスライドの位置にしてから1枚目分スライドする
      if (sliderCurrentPos == (count * this.winW / this.count)) {
        console.log(sliderCurrentPos)
        TweenMax.set(_this.elId, {
          x: -(count * this.winW / this.count) * this.itemLen,
        })
        slideDirection = -(count * this.winW / this.count) * (this.itemLen - 1)
        _this.setActive(this.itemLen)
      }

      //現在の位置が0の初期位置の場合、ループ処理
      if (Math.abs(sliderCurrentPos) == 0) {
        console.log('ループ')
        loopFlag = true
        _this.setActive(_this.itemLen)
      }
    }

    this.tween = TweenMax.to(this.elId, this.slideSpeed, {
      x: slideDirection,
      onComplete: function () {
        //引数のコールバックが関数だった場合実行
        if (typeof callBack === 'function') {
          callBack()
        }
        if (loopFlag && direction == 'next') {
          TweenMax.set(_this.elId, {
            x: 0,
          })
        } else if (loopFlag && direction == 'prev') {
          TweenMax.set(_this.elId, {
            x: -(count * _this.winW / _this.count) * (_this.itemLen - 1),
          })
        }
        loopFlag = false
      }
    });
  }

  /*------------------------------
  * アニメーション中断
  ------------------------------*/
  skipSlideAnimate() {
    if (TweenMax.isTweening(this.elId) == true) {
      this.tween.seek(this.slideSpeed)
      this.removeActive()

      console.log('アニメーションすっ飛ばし')
    }
  }

  /*------------------------------
  * 自動スライドアニメーション
  ------------------------------*/
  autoAnimate() {
    let _this = this
    let timeOut
      = this.slideType == 'slide' ? this.autoSlide * 1000 + this.slideSpeed * 1000
        : this.slideType == 'fade' ? this.autoFade * 1000 + this.fadeSpeed * 1000
          : 0

    this.setIntervalId = setInterval(() => {
      _this.getCurrentActive()

      //次のスライドがある場合
      if (_this.currentActiveNum <= _this.itemLen) {
        if (_this.slideType == 'slide') {
          _this.setActive(_this.currentActiveNum + 1)
          _this.doSlideAnimate('next', 1, _this.endFunc)
        } else if (_this.slideType == 'fade') {
          let currentSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.currentActiveNum - 1]
          let NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.currentActiveNum]
          _this.setActive(_this.currentActiveNum + 1)
          _this.doFadeAnimate(currentSlide, NextSlide)
        }
      } else {
        if (_this.slideType == 'slide') {
          _this.setActive(1)
          _this.doSlideAnimate('next', 1, _this.endFunc)
        } else if (_this.slideType == 'fade') {
          let currentSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.itemLen - 1]
          let NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[0]
          _this.setActive(1)
          _this.doFadeAnimate(currentSlide, NextSlide)
        }
      }
    }, timeOut);
  }

  /*------------------------------
  * 自動アニメーション中止
  ------------------------------*/
  stopAutoAnimate() {
    if (this.setIntervalId != null) {
      clearInterval(this.setIntervalId)
      this.setIntervalId = null
    }
  }

  /*------------------------------
  * ホバーで自動アニメーションを止める
  ------------------------------*/
  setHoverEventAutoAnimation() {
    let _this = this
    this.cont.addEventListener('mouseenter', setHoverEvent, { passive: false })
    this.cont.addEventListener('mouseleave', clearHoverEvent, { passive: false })

    function setHoverEvent() {
      _this.stopAutoAnimate()
    }
    function clearHoverEvent() {
      _this.autoAnimate()
    }
  }

  /*------------------------------
  * フェードスライダーの初期処理
  ------------------------------*/
  setFadeSlider() {
    let _this = this
    let activeSlide = document.querySelectorAll(`${this.wrapId} .merry-slide-active`)[0]
    TweenMax.set(activeSlide, {
      zIndex: _this.itemLen
    })
  }

  /*------------------------------
  * フェードクリックイベントの付与
  * 左右矢印とインジケーターにクリックでフェードするイベントを付与する
  ------------------------------*/
  setFadeClickEvent() {
    document.querySelectorAll(this.wrapId)[0].classList.add('merry-fade')
    let _this = this
    let indicatorBtn = document.querySelectorAll(`${this.wrapId} .merry-dot`)
    let arrowBtn = document.querySelectorAll(`${this.wrapId} .merry-arrow`)

    //インジケータークリック時
    function fadeIndicatorClickEvent(e) {
      console.log('Fade indicatorClickEvent')
      let clickBtn = e.target
      let clickBtnP = clickBtn.tagName == 'LI' ? clickBtn : clickBtn.parentElement
      let nextSlideNum = Number(clickBtnP.attributes['data-dot']["value"])
      //現在のカレント表示を取得
      _this.getCurrentActive()
      let currentSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.currentActiveNum - 1]
      let NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[nextSlideNum - 1]
      _this.setActive(nextSlideNum)
      _this.doFadeAnimate(currentSlide, NextSlide)
    }

    //左右矢印クリック時
    function fadeArrowClickEvent(e) {
      console.log('Fade arrowClickEvent')
      let clickBtn = e.target
      let clickBtnP = clickBtn.offsetParent

      //現在のカレント表示を取得
      _this.getCurrentActive()
      let currentSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.currentActiveNum - 1]
      let NextSlide

      //次へボタンを押したとき
      if (clickBtnP.className.indexOf('next') > -1) {
        //一番最後のスライドがカレントだった場合
        if (_this.currentActiveNum >= _this.itemLen) {
          NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[0]
          _this.setActive(1)
        } else {
          NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.currentActiveNum]
          _this.setActive(_this.currentActiveNum + 1)
        }
      }

      //前へボタンを押したとき
      if (clickBtnP.className.indexOf('prev') > -1) {
        //一番最初のスライドがカレントだった場合
        if (_this.currentActiveNum <= 1) {
          NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.itemLen - 1]
          _this.setActive(_this.itemLen)
        } else {
          NextSlide = document.querySelectorAll(`${_this.wrapId} .merry-slide`)[_this.currentActiveNum - 2]
          _this.setActive(_this.currentActiveNum - 1)
        }
      }
      _this.doFadeAnimate(currentSlide, NextSlide)
    }

    this.setEventEachEl(indicatorBtn, 'click', fadeIndicatorClickEvent)
    this.setEventEachEl(arrowBtn, 'click', fadeArrowClickEvent)
  }

  /*------------------------------
  * フェードアニメーション
  * @param {String} direction
  ------------------------------*/
  doFadeAnimate(currentSlide, NextSlide) {
    let _this = this

    TweenMax.fromTo(currentSlide, this.fadeSpeed,
      {
        zIndex: _this.itemLen,
        opacity: 1,
      },
      {
        opacity: 0,
        position: 'absolute'
      }
    )

    TweenMax.fromTo(NextSlide, this.fadeSpeed,
      {
        zIndex: _this.itemLen + 1,
        opacity: 0,
        position: 'relative'
      },
      { opacity: 1 }
    )
  }

  resize() {
    let _this = this
    window.addEventListener('resize', function () {
      _this.winW = document.body.clientWidth
    })
  }
}
