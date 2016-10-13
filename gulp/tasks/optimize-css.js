/**
 * optimize css in place for production
 * @tasks/optimize-css
 */
'use strict';
var cleanCSS = require('gulp-clean-css');
var util = require('gulp-util');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {

  var d1 = new Date();
  return function () {
    return gulp.src(options.css.src)
      .pipe(cleanCSS().on('error', util.log))
      .pipe(gulp.dest(options.dist))
      .on('error', util.log)
      .on('finish', function () {
        var d2 = new Date();
        var seconds = (d2 - d1) / 1000;
        util.log('@tasks/optimize-css complete ', seconds + 's')
      })
  };
};