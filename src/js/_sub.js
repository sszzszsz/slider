// module.exportを使ってhello関数を定義する。
export const hello = (message) => {
  console.log(`${message}を出力しました`);
};

export default class MerryGoRound {

  constructor(option) {
    this.elId = option.el;
    this.indicator = option.indicator;
    this.count = option.count;
    this.slideSpeed = option.slideSpeed;

    this.init();
  }

  init() {
    this.setSlideStyle()
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

    //インジケーターの設定
    this.setIndicator()
  }

  /*------------------------------
  // インジケーターの設定
  // optionがfalse出ない限り表示する
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
}
