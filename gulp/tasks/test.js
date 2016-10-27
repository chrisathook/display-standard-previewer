/**
 * Deletes specified directory.
 * @tasks/test
 */
'use strict';
var del = require('del');
var util = require('gulp-util');
var jasmine = require('gulp-jasmine'); // injects globals of 'describe' and 'it'
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to delete.
 * @returns {Function}
 */
module.exports = function (gulp, options) {
  try {
    return function (done) {
      util.log('@tasks/test start ');
      var d1 = new Date();
      gulp.src(options.src)
        .pipe(jasmine({
            verbose: true
          })
          .on('error', function () {
            util.log("!!! ONE OR MORE TEST FAILED !!!")
          })
          .on('jasmineDone', function () {
            var d2 = new Date();
            var seconds = (d2 - d1) / 1000;
            util.log('@tasks/test complete ', seconds + 's');
            done()
          })
        );
    };
  } catch (err) {
    util.log(err);
  }
};
/*
 function () {
 var d2 = new Date();
 var seconds = (d2 - d1) / 1000;
 util.log('@tasks/test complete ', seconds + 's');
 done()
 }*

 */
