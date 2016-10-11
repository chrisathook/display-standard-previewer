/**
 * optimize css in place for production
 * @tasks/optimize-css
 */
'use strict';

var uglify = require('gulp-uglify');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp,  options, flags) {
  return function() {
    return gulp.src(options.js.src)
      .pipe(uglify({'compress':{'drop_console':!flags.sourcemap}}))
      .pipe(gulp.dest(options.dist))

  };
};