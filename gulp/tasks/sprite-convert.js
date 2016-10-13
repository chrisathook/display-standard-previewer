/**
 * convert spritesheet images into jpg for production
 * @tasks/osprite-convert
 */
'use strict';
var jimp = require('gulp-jimp');
var util = require('gulp-util');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    try {
      if (flags.type === 'dev') {
        return gulp.src(options.src)
          .pipe(util.noop())
      }
    } catch (err) {
      util.log(err);
    }
    try {
      return gulp.src(options.src)
        .pipe(jimp({
          '': {
            type: 'jpg',
            quality: options.quality
          }
        }))
        .pipe(gulp.dest(options.dist))
    } catch (err) {
      util.log(err);
    }
  };
};