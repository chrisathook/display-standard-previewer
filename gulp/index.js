'use strict';

var gulp = require('gulp');
var config = require('./config');
var bs = require('browser-sync').create();

module.exports = function (opts, task) {
  return new Promise(function (resolve, reject) {




    gulp.task('resolve', function (done) {
      console.log('gulp done');
      resolve();
      done();
    });

    gulp.task('sass', require('./tasks/lib-sass')(gulp, bs, config.sass, config.flags));
    gulp.task('sprite-collapsed-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_foreground, config.flags));
    gulp.task('sprite-collapsed-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_background, config.flags));
    gulp.task('sprite-all', gulp.parallel('sprite-collapsed-foreground', 'sprite-collapsed-background'));

    gulp.series('sprite-all','sass','resolve').call();
  });
};