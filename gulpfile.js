const gulp = require('gulp');
const pug = require('gulp-pug'); //pugコンパイル
const sass = require('gulp-sass'); //Sassコンパイル
const uglify = require('gulp-uglify'); //js圧縮
const plumber = require('gulp-plumber'); //エラー時の強制終了を防止(notifyとセット)
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
const sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
const postcss = require('gulp-postcss'); //autoprefixerとセット
const autoprefixer = require('autoprefixer'); //ベンダープレフィックス付与(PostCSSの一機能)
const cssdeclsort = require('css-declaration-sorter'); //css並べ替え
const browserSync = require('browser-sync').create(); //更新時自動リロード
const lec = require('gulp-line-ending-corrector'); //改行コードをCR+LFに変換（不要な場合削除）
//画像圧縮
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
//ES5
const babel = require('gulp-babel');
//json
const data = require('gulp-data');
//path
const srcDir = './src';
const distRootDir = './public';
const distDir = './public';


// ◯gulp-pug
gulp.task('pug', function () { //タスク登録
  return gulp.src([srcDir + '/pug/**/*.pug', '!' + srcDir + '/pug/**/_*.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(lec({
      verbose: false,
      eolc: 'LF'
    }))
    .pipe(gulp.dest(distDir)); //コンパイル後に出力したい場所
});


// ◯gulp-sass
gulp.task('sass', function () {
  return gulp.src([srcDir + '/scss/**/*.scss', '!' + srcDir + '/scss/**/_*.scss'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sassGlob())// ◯sassGlob / @importの読み込みを簡潔にする
    .pipe(sass({ outputStyle: 'compressed' })) //expanded, nested, campact, compressedから選択
    .pipe(postcss([
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie >= 11', 'Android >= 4'],// ◯autoprefixer / 対象ブラウザ ◯postCSS
        cascade: false //インデント整形
      })
    ]))
    .pipe(lec({
      verbose: false,
      eolc: 'LF'
    }))
    .pipe(gulp.dest(distDir + '/assets/css'));
});


// ◯gulp-babel
gulp.task('babel', () => {
  return gulp.src([srcDir + '/js/**/*.js', '!' + srcDir + '/js/**/_*.js'])
    .pipe(babel({
      'presets': ['@babel/preset-env']
    }))
    .pipe(uglify()) // ◯gulp-uglify / jsの圧縮
    .pipe(lec({
      verbose: false,
      eolc: 'LF'
    }))
    .pipe(gulp.dest(distDir + '/assets/js'));
})


// ◯magemin・pngquant・mozjpeg / 圧縮率の定義
gulp.task('imagemin', function () {
  return gulp.src([srcDir + '/img/**/*.{jpg,jpeg,png,gif,svg}', '!' + srcDir + '/img/**/_*.{jpg,jpeg,png,gif,svg}'])
    .pipe(imagemin([
      pngquant({ quality: [.7, .85], speed: 1 }),
      mozjpeg({ quality: 80 }),
      imagemin.svgo(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest(distDir + '/assets/img'));
})


// ◯browserSync
gulp.task('browser-sync', function (done) {
  browserSync.init({
    server: {
      baseDir: distRootDir,
    },
    reloadOnRestart: true,
    startPath: '/index.html',
  });
  done();
});

gulp.task('browser-reload', function () {
  browserSync.reload();
});

// 監視(watch)
gulp.task('watch', function () {
  gulp.watch(srcDir + '/pug/**/*.pug').on('change', gulp.series('pug', 'browser-reload'))
  gulp.watch(srcDir + '/scss/**/*.scss').on('change', gulp.series('sass', 'browser-reload'));
  gulp.watch(srcDir + '/js/**/*.js').on('change', gulp.series('babel', 'browser-reload'));
  gulp.watch(srcDir + '/img/**/*.{jpg,jpeg,png,gif,svg}', gulp.task('imagemin'));
});

// default
gulp.task('default', gulp.parallel('browser-sync', 'watch'));
