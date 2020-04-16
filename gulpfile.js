const {src, dest, watch, series} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const htmlmin = require('gulp-htmlmin');
const tinypng = require('gulp-tinypng-compress');
 
function bs() {
    serveSass();
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
    watch('./src/*.html').on('change', browserSync.reload);
    watch('./src/sass/**/*.sass', serveSass);
    watch('./src/sass/**/*.scss', serveSass);
    watch('./src/js/*.js').on('change', browserSync.reload);
}

function serveSass() {
    return src('./src/sass/**/*.sass', './src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('./src/css'))
        .pipe(browserSync.stream())
}

function buildCSS(done) {
    src('./src/css/**/**.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(dest('./src/dist/css/'));
    done();
}

function buildJS(done) {
    src(['src/js/**.js', '!src/js/**.min.js'])
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            }
        }))
        .pipe(dest('src/dist/js/'));
        src('src/js/**.min.js').pipe(dest('src/dist/js/'));
    done();
}

function html(done) {
    src('src/**.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('src/dist/'));
    done();
}

function php(done) {
    src('src/**.php')
        .pipe(dest('src/dist/'));
        src('src/phpmailer/**/**')
        .pipe(dest('src/dist/phpmailer/'));
    done();
}

function fonts(done) {
    src('src/font/**/**')
        .pipe(dest('src/dist/font'));
    done();
}

function imagemin(done) {
    src('src/img/**/*.{png,jpg,jpeg}')
        .pipe(tinypng({
            key: '9G3cRD6vvbhQJtCXhC1wNs9d8x8vpPd9',
            sigFile: 'img/.tinypng-sigs',
            log: true
        }))
        .pipe(dest('src/dist/img/'));
    done();
}

exports.serve = bs;
exports.build = series(buildCSS, buildJS, php, fonts, imagemin);