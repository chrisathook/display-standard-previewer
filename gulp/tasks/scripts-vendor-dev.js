/**
 * Blind Copy vendor scripts during dev
 * @tasks/images
 */
'use strict';
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp, bs, options,flags) {
  return function() {
    return gulp.src(options.src)
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  };
};