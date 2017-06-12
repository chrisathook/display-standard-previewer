/**
 * optimize css in place for production
 * @tasks/optimize-html
 */
'use strict';
let htmlmin = require('gulp-htmlmin');
let util = require('gulp-util');
let flatten = require('gulp-flatten');
let cheerio = require('cheerio');
let fs = require('fs');
/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {
    util.log('@tasks/optimize-html start ');
    let d1 = new Date();
    try {
  
      
  
      var htmlPath = options.html.entry;
      var html = fs.readFileSync(htmlPath, 'utf8');
      
      let $ = cheerio.load(html);
      let metaTags = $('meta');
  
      
      let value = true;
      metaTags.each(function (i, tag) {
        let name = tag.attribs['name'];
        let content = tag.attribs['content'];
        if (!name) return;
        //util.log('!!! META',name);
        
        if (name.indexOf('ad.minifyhtml') !== -1) {
          
          
          if (content ==='false') {
  
            value = false
          }
          
        }else {
          value = true;
          
        }
      });
      
      return gulp.src(options.html.src)
        .pipe(htmlmin({collapseWhitespace: value,conservativeCollapse:true, removeComments: true}).on('error', util.log))
        .pipe (flatten())
        .pipe(gulp.dest(options.dist))
        .on('error', util.log)
        .on('finish', function () {
          let d2 = new Date();
          let seconds = (d2 - d1) / 1000;
          util.log('@tasks/optimize-html complete ', seconds + 's')
        })
    } catch (err) {
      util.log(err);
    }
  };
};