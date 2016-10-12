/**
 * Concants JS files in HTML
 * @tasks/scripts-vendor
 */
'use strict';
var useref = require('gulp-useref');
var source = require('vinyl-source-stream');
var util = require('gulp-util');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.entry : Path to the entry js file.
 * options.dist : Destination directory for file output.
 * @param flags - object
 * flags.minify : boolean
 * flags.sourcemap : boolean
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
    util.log('@tasks/scripts-vendor start ');
    var d1 = new Date();
    return gulp.src(options.entry)
      .pipe(useref().on('error', util.log))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream()).on('error', util.log)
      .on('finish', function () {
        var d2 = new Date();
        var seconds = (d2 - d1) / 1000;
        util.log('@tasks/build complete ', options.prefix, seconds + 's')
      })
  };
};