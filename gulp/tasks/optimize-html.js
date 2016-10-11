/**
 * optimize css in place for production
 * @tasks/optimize-css
 */
'use strict';

var htmlmin = require('gulp-htmlmin');

/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp,  options, flags) {
  return function() {
    return gulp.src(options.html.src)
      .pipe(htmlmin({collapseWhitespace: true,removeComments:true}))
      .pipe(gulp.dest(options.dist))

  };
};