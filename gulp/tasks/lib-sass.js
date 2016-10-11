/**
 * Compiles sass to css
 * @tasks/sass
 */
'use strict';
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {

    return gulp.src(options.src)
      .pipe(sass({includePaths: [require("bourbon").includePaths]}).on('error', sass.logError))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  }
};


