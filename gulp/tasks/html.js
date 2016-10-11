/**
 * Compiles gulp-file-include and copies the final file
 * @tasks/html
 */
'use strict';
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @returns {Function}
 */
module.exports = function(gulp, bs, options,flags) {
  return function() {

    var path = [];

    path.push (options.src);

    if (flags.type==="prod") {
      path.push ("!"+options.entry)

    }

    return gulp.src(path)
      .pipe (gulpif (flags.type ==="dev",replace ('../../vendor','vendor')))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  };
};