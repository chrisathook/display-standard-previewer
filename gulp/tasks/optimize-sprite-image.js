/**
 * optimize css in place for production
 * @tasks/optimize-sprite-image
 */
'use strict';

var util = require('gulp-util');

var gulpTinifyImg = require('gulp-tinify-img');
var flatten = require('gulp-flatten');
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

        util.log('@tasks/optimize-sprite-image Skipping TinyPNG ');

        return gulp.src(options.sprite_image.src)
          .pipe (flatten({ includeParents: -1}))
          .pipe(gulp.dest(options.dist))
      }

      util.log('@tasks/optimize-sprite-image Using TinyPNG ');
      return gulp.src(options.sprite_image.src)
        .pipe(gulpTinifyImg({tinify_key: tinypngkey, log: false}).on('error', util.log))
        .pipe (flatten({ includeParents: -1}))
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

