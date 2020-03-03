const webpack = require('webpack');
const path = require('path');
const globule = require('globule');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 公開フォルダ・作業フォルダのディレクトリ指定
const dir = {
  src: path.join(__dirname, 'src'),
  public: path.join(__dirname, 'public')
};

// 対となる変換ファイルの拡張子指定
const convertExtensions = {
  pug: 'html',
  scss: 'css',
  ts: 'js',
  js: 'js'
};

//development:開発, production:本番
const mode = 'development';

// エントリーポイントの格納先
const entry = {
  pug: {},
  scss: {},
  ts: {},
  js: {}
};
const pagelist = require('./pug.config.js');

Object.keys(convertExtensions).forEach(from => {
  const to = convertExtensions[from];
  globule.find([`**/*.${from}`, `!**/_*.${from}`], { cwd: dir['src'] }).forEach(filename => {
    let _output = filename.replace(new RegExp(`.${from}$`, 'i'), `.${to}`);
    let _source = path.join(dir['src'], filename);
    if (_output.indexOf('pug/') !== -1) {
      _output = _output.replace('pug/', '');
      entry['pug'][_output] = _source;
    }
    if (_output.indexOf('scss/') !== -1) {
      _output = _output.replace('scss/', 'css/');
      entry['scss'][_output] = _source;
    }
    // if (_output.indexOf('ts/') !== -1) {
    //   _output = _output.replace('ts/', 'js/');
    //   entry['ts'][_output] = _source;
    // }
    if (_output.indexOf('js/') !== -1) {
      _output = _output.replace('js/', 'js/');
      entry['js'][_output] = _source;
    }
  });
});

/*----------------------------------------------------------------------
// pugファイルからhtmlファイルに出力
// 1. pug.config.jsを読み込む（このファイルには、各ページの情報が記載されてます）
// 2. pugファイルからhtmlファイルに出力する際、getPageListData関数を実行する
// 3. getPageListData関数によって、pugファイルに各ページの情報を取り込む
// 4. htmlファイルを出力する
----------------------------------------------------------------------*/
function getPageListData() {
  let _data = {};
  for (let i = 0; i < pagelist.data.length; i++) {
    _data[pagelist.data[i]['name']] = pagelist.data[i];
  }
  return _data;
}

// scssファイルの設定
const scssLoader = {
  use: [
    {
      loader: 'css-loader',
      options: {
        url: false //ファイルパスの解決
      }
    },
    'csscomb-loader',
    {
      loader: 'postcss-loader'
    },
    {
      loader: 'sass-loader'
    }
  ]
};
const scssConfig = {
  mode: mode,
  entry: entry['scss'],
  output: {
    filename: '[name]',
    publicPath: '/',
    path: dir['public']
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(scssLoader)
      }
    ]
  },
  plugins: [new ExtractTextPlugin('[name]')],
  cache: true
};

// pugファイルの設定
const pugLoader = {
  use: [
    'html-loader',
    {
      loader: 'pug-html-loader',
      options: {
        pretty: true,
        data: {
          pagelist: getPageListData()
        }
      }
    }
  ]
};
const pugConfig = {
  mode: mode,
  entry: entry['pug'],
  output: {
    filename: '[name]',
    publicPath: '/',
    path: dir['public']
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ExtractTextPlugin.extract(pugLoader)
      }
    ]
  },
  plugins: [new ExtractTextPlugin('[name]')],
  cache: true
};

// jsファイルの設定
const es6Config = {
  mode: mode,
  entry: entry['js'],
  output: {
    filename: '[name]',
    publicPath: '/',
    path: dir['public']
  },
  module: {
    rules: [
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
                '@babel/preset-env',
              ]
            }
          }
        ]
      }
    ]
  },
}

module.exports = [scssConfig, es6Config, pugConfig];
