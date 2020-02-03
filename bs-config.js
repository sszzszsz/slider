const SSI = require('./node_modules/browser-sync');

module.exports = {
	"files": './public/**/*.css, ./public/**/*.js, ./public/**/*.html',
	"server": {
		baseDir: './public/',
		index: 'index.html'
	},
	"online": true,
	"open": 'external',
	"proxy": false,
	"port": 3000
}