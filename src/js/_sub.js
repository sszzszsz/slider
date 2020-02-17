// module.exportを使ってhello関数を定義する。
export const hello = (message) => {
  console.log(`${message}を出力しました`);
};

export default class MerryGoRound {

  constructor(option) {
    this.elId = option.el;
    this.indicator = option.indicator;
    this.arrow = option.arrow;
    this.count = option.count;
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
  // sliderの初期設定
  // 
  ------------------------------*/
  setSlideStyle() {
    this.list = document.getElementById(this.elId);
    this.list.classList.add('merry-cont')
    this.list.outerHTML = `<div class='merry-wrap'>${this.list.outerHTML}</div>`;
    console.log(this.list)
    this.cont = document.getElementById(this.elId).parentNode
  }

  /*------------------------------
  // インジケーターの設定
  // option:indicator がfalseでない限り表示する
  ------------------------------*/
  setIndicator() {
    if (this.indicator != false) {
      this.itemLen = this.list.childElementCount
      //インジケーターの親要素を作成する
      let newDotWrap = document.createElement('ul');
      newDotWrap.setAttribute('class', 'merry-indicator');
      this.cont.insertBefore(newDotWrap, this.list.nextSibling)

      //slideのアイテム数ボタンを作成
      for (let i = 0; i < this.itemLen; i++) {
        let newDot = document.createElement('li');
        let newDotBtn = document.createElement('button');
        let newDotContent = document.createTextNode(i + 1); // テキストノードを作成
        newDotBtn.appendChild(newDotContent);
        newDot.appendChild(newDotBtn);
        newDot.setAttribute('class', 'merry-dot');

        this.DotWrap = document.getElementById(this.elId).nextElementSibling
        this.DotWrap.appendChild(newDot);
      }
    }
  }

  /*------------------------------
  // 左右矢印の設定
  // option:arrow がfalseでない限り表示する
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

        this.ArrowWrap = document.getElementById(this.elId).previousElementSibling
        this.ArrowWrap.appendChild(newArrow);
      }
    }
  }

  /*------------------------------
  // スライドする枚数の設定
  // countが指定してあればその枚数、指定がなければ1枚
  ------------------------------*/
  setSlider() {
    let winW = window.innerWidth;
    let slideCount = this.count > 0 ? this.count : 1
    let slideItmes = document.getElementById(this.elId).children;
    console.log(slideItmes)
    for (let i = 0; i < slideItmes.length; i++) {
      slideItmes[i].setAttribute('class', 'merry-slide');
    }

    TweenMax.set('.merry-slide', {
      width: 100 / slideCount + '%'
    });
  }
}
