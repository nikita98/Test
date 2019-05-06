'use strict';

import gulp from "gulp";

var watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    fileinclude = require('gulp-file-include'),
    babel = require("gulp-babel"),
    plumber = require('gulp-plumber'),
    svgSprite = require('gulp-svg-sprite');

const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        scss: 'src/scss/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        icons: 'src/img/ui/icons/*.svg',
        sprite: 'src/img/ui/icons/',
    },
    watch: {
        html: 'src/**/*.html',
        js: ['src/js/**/*.js', 'src/js/**/*.vue'],
        scss: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
    }
};

const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil",
    open: false
};


/**
 * Compilers for HTML & assets
 */

// Compile HTML
const compileHtml = () => {
    return gulp.src([path.src.html])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({
            stream: true
        }));
};

// Compile Styles
const compileStyles = () => {
    return gulp.src(path.src.scss)
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({
            stream: true
        }));
};

// Compile JS
const compileJS = () => {
    return gulp.src(path.src.js)
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({
            stream: true
        }));
};

// Compile Images
const compileImages = () => {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({
            stream: true
        }));
};

// Compile Icons
const compileIcons = () => {
    return gulp.src(path.src.icons)
        .pipe(svgSprite({
            mode: {
                css: {
                    bust: false,
                    dest: "sprite",
                    prefix: ".icon-%s",
                    dimensions: "-size",
                    sprite: "sprite.svg",
                    example: true,
                    render: {
                        scss: true,
                        css: true
                    }
                }
            }
        }))
        .pipe(gulp.dest(path.src.sprite))
        .pipe(reload({
            stream: true
        }));
};

// Compile Fonts
const compileFonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({
            stream: true
        }));
};

// Compile everything together
const compile = gulp.parallel(compileHtml, compileStyles, compileJS, compileImages, compileFonts, compileIcons);
compile.description = 'compile all sources'


/**
 * Watchers for html & assets
 */

const watchHtml = () => {
    return gulp.watch(path.watch.html, compileHtml);
};

const watchStyles = () => {
    return gulp.watch(path.watch.scss, compileStyles);
};

const watchJS = () => {
    return gulp.watch(path.watch.js, compileJS);
};

const watchImages = () => {
    return gulp.watch(path.watch.img, compileImages);
};

const watch = gulp.parallel(watchHtml, watchStyles, watchJS, watchImages);

const webserver = () => {
    return browserSync(config);
};

const serve = gulp.series(compile, webserver);

// Default Gulp Task
const defaultTasks = gulp.parallel(serve, watch);

export {
    compileHtml,
    compileStyles,
    compileJS,
    compileImages,
    compileFonts,
    compileIcons,
    watchHtml,
    watchImages,
    watchJS,
    watchStyles,
    watch,
    compile,
    serve
}

export default defaultTasks

gulp.task('default', defaultTasks);