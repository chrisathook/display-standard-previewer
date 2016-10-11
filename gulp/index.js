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

    gulp.task('reload', function (done) {

        bs.reload();

        done();
        });

    gulp.task('sass', require('./tasks/lib-sass')(gulp, bs, config.sass, config.flags));
    gulp.task('sprite-collapsed-foreground', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_foreground, config.flags));
    gulp.task('sprite-collapsed-background', require('./tasks/sprite-images')(gulp, bs, config.sprite.collapsed_background, config.flags));
    gulp.task('sprite-all', gulp.parallel('sprite-collapsed-foreground', 'sprite-collapsed-background'));
    // define watch actions
    gulp.task('watch', function (done) {
      var callback = function () {
        resolve();
      };
      bs.init({
        server: {
          baseDir: config.server.root
        },
        online: false,
        port: config.server.port,
        reloadDelay: 250,
        reloadDebounce: 250,
        ghostMode: {
          clicks: false,
          forms: false,
          scroll: false
        }
      }, callback);
      gulp.watch(config.sass.watch_src, gulp.series('sass')); // only watch files not associated with spritesheets
      // generate new sass partials for spritesheets when images edited
      gulp.watch(config.sprite.collapsed_foreground.src, gulp.series('sprite-collapsed-foreground'));
      gulp.watch(config.sprite.collapsed_background.src, gulp.series('sprite-collapsed-background'));
      gulp.watch(config.reload.src, gulp.series('reload'));
      done();
    });
    if (task === 'watch') {
      gulp.series('sprite-all', 'sass', 'watch').call();
    } else if (task === 'end-watch') {
      bs.exit ();

    } else if (task === 'sass') {

      gulp.series('sass', 'resolve').call();

    } else if (task === 'sprite') {

      gulp.series('sprite-all', 'resolve').call();

    } else if (task === 'build') {

      gulp.series('sprite-all', 'sass', 'resolve').call();

    } else if (task === 'default') {

      gulp.series('sprite-all', 'sass', 'resolve').call();

    } else {
      resolve()
    }
  });
};