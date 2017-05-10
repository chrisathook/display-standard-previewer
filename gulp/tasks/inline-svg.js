/**
 * inline svgs into javascript file
 * @tasks/inline-svg
 */
'use strict';
const htmlmin = require('gulp-htmlmin');
const util = require('gulp-util');
const flatten = require('gulp-flatten');
const textTransformation = require('gulp-text-simple');
const path = require('path');
const replace = require('gulp-string-replace');

/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    return new Promise(function (resolve, reject) {
      util.log('@tasks/inline-svg start ');
      let d1 = new Date();
      try {
        let data = {};
        let transformString = function (s, options) {
          // do whatever you want with the text content of a file
          let name = path.win32.basename(options.sourcePath).replace('.svg', '');
          s = s.replace('\'', '"');
          data[`${name}`] = s;
          console.log(name);
          return s;
        };
        let myTransformation = textTransformation(transformString);
        return gulp.src(options.src)
          .pipe(myTransformation())
          .on('error', util.log)
          .on('finish', function () {
            //console.log(data);
            
            let item = JSON.stringify(data);
  
            let replaceOptions = {
              logs: {
                enabled: false
              }
            };
            
            
            gulp.src(options.template)
              .pipe(replace(/DATA_HERE/, item,replaceOptions))
              .pipe(replace(/http:\/\//g, 'https://',replaceOptions))
              .pipe(replace(/'/g, '"',replaceOptions))
              .pipe (flatten())
              .pipe(gulp.dest(options.dist))
              .on('error', util.log)
              .on('finish', function () {
                let d2 = new Date();
                let seconds = (d2 - d1) / 1000;
                util.log('@tasks/inline-svg complete ', seconds + 's');
                resolve();
              });
          })
        /*
         
         .pipe(gulp.dest(options.dist))
         .on('error', util.log)
         .on('finish', function () {
         let d2 = new Date();
         let seconds = (d2 - d1) / 1000;
         util.log('@tasks/inline-svg complete ', seconds + 's')
         })
         */
      } catch (err) {
        util.log(err);
        resolve(err);
      }
    });
  };
};