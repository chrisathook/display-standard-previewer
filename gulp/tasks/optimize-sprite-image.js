/**
 * optimize css in place for production
 * @tasks/optimize-sprite-image
 */
'use strict';

var util = require('gulp-util');

var gulpTinifyImg = require('gulp-tinify-img')
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {

  try {
    return function () {
      var d1 = new Date();
        util.log('@tasks/optimize-sprite-image start ');
      return gulp.src(options.sprite_image.src)
        .pipe(gulpTinifyImg({tinify_key: '19URTw8E53FrWs3OQ86dwcMD9oxBN8my', log: true}).on('error', util.log))
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/optimize-sprite-image complete ', seconds + 's')
        })
    };
  } catch (err) {
    util.log(err);
  }
};

