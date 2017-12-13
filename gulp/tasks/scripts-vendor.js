/**
 * Concants JS files in HTML
 * @tasks/scripts-vendor
 */
'use strict';
var useref = require('gulp-useref');
var source = require('vinyl-source-stream');
var util = require('gulp-util');
var lec = require('gulp-line-ending-corrector');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var debug = require('gulp-debug');
var lazypipe = require('lazypipe');
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

//.pipe(uglify({'compress': {'drop_console': !flags.sourcemap}}).on('error', util.log))
module.exports = function (gulp, bs, options, flags) {
  return function () {
    util.log('@tasks/scripts-vendor start ');
    var d1 = new Date();
    try {
      return gulp.src(options.entry)
        .pipe(lec())
        .pipe(useref(
          {newLine:'\n\n'},
          lazypipe().pipe(
            function () {
              return gulpif('!**/*.min.js', uglify({'compress': {'drop_console': !flags.sourcemap}}).on('error', util.log))
            }
          )
        ).on('error', util.log))
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream()).on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/build complete ', options.prefix, seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};