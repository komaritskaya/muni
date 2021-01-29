"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var server = require("browser-sync").create();

var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

var imagemin = require("gulp-imagemin");
var imageminJpegtran = require("imagemin-jpegtran");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

var ghPages = require('gh-pages');
var path = require('path');

var del = require("del");

gulp.task("css", function () {
  return gulp.src("src/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imageminJpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("js", function() {
  return gulp.src("src/js/*.js")
    .pipe(gulp.dest("build/js"));
});

gulp.task("webp", function() {
  return gulp.src("src/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
  return gulp.src("src/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("src/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/less/**/*.less", gulp.series("css"));
  gulp.watch("src/js/*.js", gulp.series("js", "refresh"));
  gulp.watch("src/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
})

gulp.task("copy", function() {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/js/**",
    "src/*.ico"
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "js",
  "css",
  "images",
  "webp",
  "sprite",
  "html"
));
gulp.task("start", gulp.series("build", "server"));

function deploy(cb) {
  ghPages.publish(path.join(process.cwd(), './build'), cb);
}

module.exports.deploy = deploy;
