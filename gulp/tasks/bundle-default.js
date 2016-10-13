/**
 * bundle dist
 * @tasks/bundle
 */
'use strict';
var zip = require('gulp-vinyl-zip').zip;
var util = require('gulp-util');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    util.log('@tasks/bundle start ');
    var d1 = new Date();
    try {
      return gulp.src(options.src)
        .pipe(zip(options.name).on('error', util.log))
        .pipe(gulp.dest(options.dist)
          .on('finish', function () {
            var d2 = new Date();
            var seconds = (d2 - d1) / 1000;
            util.log('@tasks/bundle complete ', options.prefix, seconds + 's')
          }));
    } catch (err) {
      util.log(err);
    }
  }
};


