/**
 * optimize css in place for production
 * @tasks/optimize-js
 */
'use strict';
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var flatten = require('gulp-flatten');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    util.log('@tasks/optimize-js start ');
    var d1 = new Date();
    try {
      return gulp.src(options.js.src)
        .pipe(uglify({'compress': {'drop_console': !flags.sourcemap}}).on('error', util.log))
        .pipe (flatten())
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/optimize-js complete ', seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};