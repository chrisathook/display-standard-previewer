/**
 * copy all source to a disk
 * @tasks/rename-standard
 */
'use strict';
var util = require('gulp-util');
var rename = require("gulp-rename");
var path = require('path');
var del = require('del');
var flatten = require ('gulp-flatten');
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
    util.log('@tasks/rename-standard start ');
    var arr = path.resolve(options.dist, '../');
    arr = arr.split(path.sep);
    var name = arr[arr.length - 1];
    var d1 = new Date();
    try {
      return gulp.src(options.src)
        .pipe(rename(function (path) {
          path.basename = name;
        }))
        .pipe (flatten())
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          del.sync([
            path.join(options.dist, '/*.jpg'),
            '!' + path.join(options.dist, `/${name}.jpg`)
          ]);
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/rename-standard complete ', options.prefix, seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};