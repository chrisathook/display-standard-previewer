/**
 * copy all source to a disk
 * @tasks/build
 */
'use strict';
var util = require('gulp-util');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
    util.log('@tasks/build start ');
    var d1 = new Date();
    return gulp.src(options.src, {base: '.'}).on('error', util.log)
      .pipe(gulp.dest(options.dist))
      .on('error', util.log)
      .on('finish', function () {
        var d2 = new Date();
        var seconds = (d2 - d1) / 1000;
        util.log('@tasks/build complete ', options.prefix, seconds + 's')
      })
  };
};