/**
 * Concants JS files in HTML
 * @tasks/scripts-vendor
 */
'use strict';
var useref = require('gulp-useref');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
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
module.exports = function(gulp, bs, options, flags) {
  return function() {
    return gulp.src (options.entry)

    .pipe(useref())
    .pipe(gulp.dest(options.dist))
    .pipe(bs.stream());


  };
};