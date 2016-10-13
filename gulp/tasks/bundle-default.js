/**
 * bundle dist
 * @tasks/bundle
 */
'use strict';
var zip = require('gulp-vinyl-zip').zip;
var util = require('gulp-util');
var fs = require("fs");
var del = require('del');
var path = require('path');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    util.log('@tasks/bundle start ');
    try {
      del.sync (path.join (options.dist,'/*.zip'));

      var file = fs.readFileSync(options.meta, 'utf8');
      var opt = Object.assign({}, options);
      if (file.search('content="in.zip') > -1) {
        opt.src[opt.src.length - 1] = opt.src[opt.src.length - 1].replace('!', '');
      }
    } catch (err) {
      util.log(err);
    }
    var d1 = new Date();
    try {
      return gulp.src(opt.src)
        .pipe(zip(opt.name).on('error', util.log))
        .pipe(gulp.dest(opt.dist)
          .on('finish', function () {
            var d2 = new Date();
            var seconds = (d2 - d1) / 1000;
            util.log('@tasks/bundle complete ', opt.prefix, seconds + 's')
          }));
    } catch (err) {
      util.log(err);
    }
  }
};


