
$(function() {

  const init = function() {
    console.log('init main');
  };

  init();

});

const breakPoint = 768;
const minWidth = 1200;
const ua = navigator.userAgent;
let contents = '';
let isTB = false;

if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') === -1) || ua.indexOf('iPad') > 0) {
	isTB = true;
} else {
	if (window.innerWidth <= breakPoint) {
		isTB = false;
	} else {
		isTB = false;
	}
}

switch (isTB) {
	case true:
		contents = 'width=' + minWidth;
		break;
	case false:
		contents = 'width=device-width, initial-scale=1';
		break;
}
const _meta = document.createElement('meta');
_meta.setAttribute('name', 'viewport');
_meta.setAttribute('content', contents);
document.getElementsByTagName('head')[0].appendChild(_meta);