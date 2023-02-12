let gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    rigger = require('rigger'),
    watch = require('gulp-watch'),
    cssmin = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');
    sass = require('gulp-sass')(require('sass'));
const ghPages = require('gulp-gh-pages');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        bootstrap_js: 'node_modules/bootstrap/dist/js/bootstrap.min.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};
gulp.task('html:build', function (done) {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        done();
});
gulp.task('style:build', function (done) {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.css)) 
        done();
});
gulp.task('fonts:build', function(done) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        done();
});
gulp.task('image:build', function (done) {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        done();
});
// gulp.task('js:concat', function () {
//     return gulp.src('./src/js/partial/*.js') //Найдем наші js файли
//         .pipe(concat('main.js')) // зберемо їх в один файл
//         .pipe(sourcemaps.init()) //Инициализируем sourcemap
//         .pipe(uglify()) //Сожмем наш js
//         .pipe(sourcemaps.write()) // пропишемо карти
//         .pipe(gulp.dest('./src/js/')) // помістимо main.js в папку src/js
// });
gulp.task('js:build', function (done) {
    gulp.src(path.src.js) //Найдем наш main файл
            .pipe(concat('main.js')) // зберемо їх в один файл
            .pipe(sourcemaps.init()) //Инициализируем sourcemap
            .pipe(uglify()) //Сожмем наш js
            .pipe(sourcemaps.write()) // пропишемо карти
            .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
            done()
});
gulp.task('bootstrap_js:build', function (done) {
    gulp.src(path.src.bootstrap_js) //Найдем наш main файл
            .pipe(concat('bootstrap.min.js')) // зберемо їх в один файл
            .pipe(sourcemaps.init()) //Инициализируем sourcemap
            .pipe(uglify()) //Сожмем наш js
            .pipe(sourcemaps.write()) // пропишемо карти
            .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
            done()
});
gulp.task('build', gulp.series('html:build', // запустимо збірку
    'style:build',
    'fonts:build',
    'image:build',
    // 'js:concat',
    'js:build',
    'bootstrap_js:build'
));

gulp.task('watch', function(){ // відслідковуємо зміни в файлах
    watch([path.watch.html], gulp.parallel('html:build'));
    watch([path.watch.style], gulp.parallel('style:build'));
    // watch([path.watch.js], gulp.parallel('js:concat'));
    watch([path.watch.js], gulp.parallel('js:build'));
    watch([path.watch.img], gulp.parallel('image:build'));
    watch([path.watch.fonts], gulp.parallel('fonts:build'));
});

gulp.task('deploy', function () {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});
