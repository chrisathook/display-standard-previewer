/**
 * optimize css in place for production
 * @tasks/optimize-html
 */
'use strict';
var htmlmin = require('gulp-htmlmin');
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
    util.log('@tasks/optimize-html start ');
    var d1 = new Date();
    try {
      return gulp.src(options.html.src)
        .pipe(htmlmin({collapseWhitespace: true,conservativeCollapse:true, removeComments: true}).on('error', util.log))
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/optimize-html complete ', seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};