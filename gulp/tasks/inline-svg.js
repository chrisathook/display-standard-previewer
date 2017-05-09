/**
 * inline svgs into javascript file
 * @tasks/inline-svg
 */
'use strict';
const htmlmin = require('gulp-htmlmin');
const util = require('gulp-util');
const flatten = require('gulp-flatten');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    util.log('@tasks/inline-svg start ');
    let d1 = new Date();
    try {
      return gulp.src(options.html.src)
        .pipe(htmlmin({collapseWhitespace: true,conservativeCollapse:true, removeComments: true}).on('error', util.log))
        .pipe (flatten())
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          let d2 = new Date();
          let seconds = (d2 - d1) / 1000;
          util.log('@tasks/inline-svg complete ', seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};