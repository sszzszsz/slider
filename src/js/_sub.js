// module.exportを使ってhello関数を定義する。
export const hello = (message) => {
  console.log(`${message}を出力しました`);
};

export default class MerryGoRound {

  constructor(option) {
    this.elId = option.el;
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
  * sliderの初期設定
  * 
  ------------------------------*/
  setSlideStyle() {
    let list = document.querySelector(this.elId);
    list.classList.add('merry-cont')
    list.outerHTML = `<div class='merry-wrap'>${list.outerHTML}</div>`

    //共通としてクラス付与後にコンストラクタに渡す
    this.cont = document.querySelector(this.elId).parentElement
    this.list = document.querySelector(this.elId)
    this.itemLen = this.list.childElementCount
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
      this.cont.insertBefore(newDotWrap, this.list.nextSibling)

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
    console.log(this.DotWrap)
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
    let slideItmes = this.list.children;
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
  * アクティブ判定
  * @param {Number} activeNum
  ------------------------------*/
  setActive(activeNum) {
    let slideItmes = this.list.children;
    let dotItems = document.querySelectorAll('.merry-dot')
    slideItmes[activeNum].classList.add('merry-slide-active')
    dotItems[activeNum].classList.add('merry-dot-active')
  }
}
