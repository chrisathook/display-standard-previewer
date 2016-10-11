'use strict';

module.exports = function (opts, task) {
  return new Promise(function (resolve, reject) {

    var gulp = require('gulp');
    var config = require('./config');
    var bs = require('browser-sync').create();

    gulp.task('resolve', function (done) {
      console.log('gulp done');
      resolve();
      done();
    });

    gulp.task('sass', require('./tasks/lib-sass')(gulp, bs, config.sass, config.flags));


    gulp.series('sass','resolve').call();
  });
};