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
module.exports = function (gulp, options, flags,tinypngkey) {

  try {
    return function () {
      var d1 = new Date();
        util.log('@tasks/optimize-sprite-image start ');

      if (tinypngkey === 'undefined' || tinypngkey === undefined ||tinypngkey ==='' || tinypngkey === null || tinypngkey.length !==32) {
        return gulp.src(options.sprite_image.src)
          .pipe(gulp.dest(options.dist))
      }

      return gulp.src(options.sprite_image.src)
        .pipe(gulpTinifyImg({tinify_key: tinypngkey, log: false}).on('error', util.log))
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

