/**
 * inline css and html
 * @tasks/inline
 */
'use strict';
var util = require('gulp-util');
var inlinesource = require('gulp-inline-source');
var del = require('del');
var replace = require('gulp-replace');
var flatten = require('gulp-flatten');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
    util.log('@tasks/inline start ');
    var d1 = new Date();
    try {
      return gulp.src(options.src)
        .pipe(inlinesource(

          {
            rootpath:options.root,
            compress: false, handlers: [
            function customjs(source, context, next) {
              if (source.fileContent && !source.content && (source.type == 'css')) {
                try {
                  //console.log (source)
                  console.log(options.src);
                  console.log(source.filepath);
                  //source.content = source.fileContent.replace(/\.\.\//g, './'); // rebase URLs
                } catch (err) {
                  console.log(err);
                }
                //util.log("!!! path", source.filepath);
                del(source.filepath, {
                  force: true
                }).then(function () {
                  next();
                })
              } else {
                next();
              }
            }
          ]
          }).on('error', util.log))
        .pipe(replace(/url\(\.\.\//g, 'url(./'))// rebase URLs
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/inline complete ', options.prefix, seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};