/**
 * Minify PNG, JPEG, GIF and SVG images.
 * @tasks/sprite-images
 */
'use strict';
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var jimp = require('gulp-jimp');
var buffer = require('vinyl-buffer');
var rename = require('gulp-simple-rename');
var path = require('path');
var util = require('gulp-util');
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
    util.log('@tasks/sprite-images start ', options.prefix);
    var d1 = new Date();
    var use_jpg = false;
    try {
      if (options.jpg_conversion === true /*&& flags.type === 'prod'*/) {
        use_jpg = true;
      }
      // Generate our spritesheet
      var spriteData = gulp.src(options.src).pipe(spritesmith({
        imgName: options.prefix + '-sprite.png',
        cssName: '_sprite-' + options.prefix + '.scss',
        padding: 4,
        imgPath: `../${options.img_root}/` + options.prefix + '-sprite.png',
        cssOpts: {functions: false,variableNameTransforms:[], prefix: options.prefix + '-map', usejpg: use_jpg},
        cssSpritesheetName: 'spritesheet',
        cssVarMap: function (sprite) {
          sprite.name = sprite.name;
        },
        cssTemplate: path.join(__dirname.replace('tasks', ''), 'scss_maps.template.handlebars')
      }).on('error', util.log));
      // Pipe image stream through image optimizer and onto disk
      var imgStream = spriteData.img;
      if (use_jpg === false) {
        imgStream.pipe(gulp.dest(options.dist_img));
      } else {
        // change file name and write png
        imgStream.pipe(rename(function (path) {
            return path.replace(options.prefix, "__" + options.prefix);
          }))
          .pipe(gulp.dest(options.dist_img_source))
          // change file name back and write jpg
          .pipe(rename(function (path) {
            return path.replace('__', '');
          }))
          .pipe(buffer())
          .pipe(jimp({
            '': {
              type: 'jpg',
              quality: options.quality
            }
          }).on('error', util.log))
          .pipe(gulp.dest(options.dist_img));
      }
    } catch (err) {
      util.log(err);
    }
    try {
      // Pipe CSS stream through CSS optimizer and onto disk
      var cssStream = spriteData.css
        .pipe(gulp.dest(options.dist_css));
      // Return a merged stream to handle both `end` events
      return merge(imgStream, cssStream)
        .pipe(bs.stream())
        .on('error', util.log)
        .on('finish', function () {
          var d2 = new Date();
          var seconds = (d2 - d1) / 1000;
          util.log('@tasks/sprite-images complete ', options.prefix, seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};