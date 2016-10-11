'use strict';
var gulp = require('gulp');
var config = require('./config');
module.exports = function (opts, task) {
  return new Promise(function (resolve, reject) {
    gulp.task('resolve', function (done) {
      console.log('gulp done');
      resolve();
      done();
    });
    gulp.series('resolve').call();
  });
};