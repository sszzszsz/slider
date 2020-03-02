import MerryGoRound from './_sub';
let Slider1 = new MerryGoRound();
Slider1.merry({
  el: '#slider',
  indicator: true,
  arrow: true,
  count: 2,
  slideSpeed: 1
})

let Slider2 = new MerryGoRound();
Slider2.merry({
  el: '#slider2',
  count: 1,
  fade: true,
  fadeSpeed: 3
})
