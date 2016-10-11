/**
 * optimize css in place for production
 * @tasks/optimize-css
 */
'use strict';

var cleanCSS = require('gulp-clean-css');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp,  options, flags) {
  return function() {
    return gulp.src(options.css.src)
      .pipe(cleanCSS())
      .pipe(gulp.dest(options.dist))

  };
};