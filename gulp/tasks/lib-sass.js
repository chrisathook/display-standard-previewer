/**
 * Compiles sass to css
 * @tasks/sass
 */
'use strict';
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var flatten = require('gulp-flatten');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
    util.log('@tasks/sass start');
    var d1 = new Date();
    try {
      return gulp.src(options.src)
        .pipe(sass({includePaths: [require("bourbon").includePaths]}).on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream())
        .on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/sass complete', seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  }
};


