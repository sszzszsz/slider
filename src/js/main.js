import { hello } from './_sub';

const message = 'Hello World';

// sub.jsに定義されたJavaScriptを実行する。
hello(message);


import MerryGoRound from './_sub';
let Slider1 = new MerryGoRound({
	el: '#slider',
	indicator: true,
	arrow: true,
	count: 1,
	slideSpeed: 0.5
});