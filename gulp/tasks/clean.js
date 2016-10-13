/**
 * Deletes specified directory.
 * @tasks/clean
 */
'use strict';
var del = require('del');
var util = require('gulp-util');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to delete.
 * @returns {Function}
 */
module.exports = function (gulp, options) {
  try {
    return function (done) {
      util.log('@tasks/clean start ');
      var d1 = new Date();
      del(options.src, {
        force: true
      }).then(function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/clean complete ', seconds + 's');
          done()
        })
        .catch(function (err) {
          util.log("!!!", err)
        })
    };
  } catch (err) {
    util.log(err);
  }
};