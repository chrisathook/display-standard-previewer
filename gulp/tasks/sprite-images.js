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
var cheerio = require('cheerio');
var fs = require('fs');
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
    try {
      var htmlPath = options.dist;
      var html = fs.readFileSync(htmlPath, 'utf8');
      var $ = cheerio.load(html);
      var metaTags = $('meta');
      options.bgColor = '#000000';
      metaTags.each(function (i, tag) {
        var name = tag.attribs['name'];
        var content = tag.attribs['content'];
        if (!name) return;
        console.log(name);
        if (name.indexOf('ad.compression') !== -1) {
          var value = Number(content) || content;
          options.quality = value
        }
        if (name.indexOf('ad.spriteBackgroundColor') !== -1) {
          options.bgColor = content;
        }
      });
    } catch (err) {
      console.error(err);
      console.error(err.stack);
    }
    var imagesDone = false;
    var cssDone = false;
    var inter = 0;
    util.log('@tasks/sprite-images start ', options.prefix, options.quality);
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
        cssOpts: {functions: false, variableNameTransforms: [], prefix: options.prefix + '-map', usejpg: use_jpg},
        cssSpritesheetName: 'spritesheet',
        cssVarMap: function (sprite) {
          sprite.name = sprite.name;
        },
        cssTemplate: path.join(__dirname.replace('tasks', ''), 'scss_maps.template.handlebars')
      }).on('error', util.log));
      // Pipe image stream through image optimizer and onto disk
      var imgStream = spriteData.img;
      if (use_jpg === false) {
        imgStream.pipe(gulp.dest(options.dist_img)).on('finish', function () {
          // console.log("!!! IMAGES DONE")
          imagesDone = true;
        });
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
              quality: options.quality,
              background: options.bgColor ,
            }
          }).on('error', util.log))
          .pipe(gulp.dest(options.dist_img))
          .on('finish', function () {
            //  console.log("!!! IMAGES DONE")
            imagesDone = true;
          })
        ;
      }
    } catch (err) {
      util.log(err);
    }
    try {
      // Pipe CSS stream through CSS optimizer and onto disk
      var cssStream = spriteData.css
        .pipe(gulp.dest(options.dist_css))
        .on('finish', function () {
          //console.log("!!! CSS DONE")
          cssDone = true
        })
      ;
      // Return a merged stream to handle both `end` events
      return new Promise(function (resolve, reject) {
        merge(imgStream, cssStream)
          .pipe(bs.stream())
          .on('error', util.log)
          .on('finish', function () {
            var endIt = function () {
              var d2 = new Date();
              var seconds = (d2 - d1) / 1000;
              util.log('@tasks/sprite-images complete ', options.prefix, seconds + 's')
              resolve();
            }
            if (cssDone === true && imagesDone === true) {
              endIt()
            } else {
              inter = setInterval(function () {
                if (cssDone === true && imagesDone === true) {
                  clearInterval(inter);
                  endIt()
                }
              }, 250)
            }
          })
      })
    } catch (err) {
      util.log(err);
    }
  };
};