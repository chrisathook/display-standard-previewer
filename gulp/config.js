'use strict';
var dest = process.cwd();
var root = process.cwd();
var path = require('path');
var config = {
  flags: {
    minify: false,
    sourcemap: true,
    type: 'dev'
  },
  clean: {
    src: dest + '/**/*'
  },reload: {
      src: [
        path.join(root, '/**/index.html'),
        path.join(root, '/libs/**/*.js'),
        path.join(root, '/images/**/*.{gif,jpg,png,svg}'),
        path.join('!', root, '/images/**/*-sprite.{gif,jpg,png,svg}')
      ]
    },

  sass: {
    src: path.join (root,'sass/**/*.scss')  ,
    watch_src: [path.join (root,'sass/**/*.scss'), path.join (root,'!./sass/spritesheets/**/*.scss')],
    dist: path.join (dest, 'css/')
  },

  sprite: {
    collapsed_foreground: {
      src: path.join (root,'_toSprite/collapsed/foreground/**/*.png'),
      dist_img: path.join (dest , '/images/'),
      dist_img_source: path.join (dest , '/images/_assets/'),
      dist_css: path.join (root,'/sass/spritesheets'),
      prefix: 'collapsed-foreground',
      jpg_conversion:false,
      quality:80
    },
    collapsed_background: {
      src: path.join (root,'_toSprite/collapsed/background/**/*.png'),
      dist_img: path.join (dest , '/images/'),
      dist_img_source: path.join (dest , '/images/_assets/'),
      dist_css: path.join (root,'/sass/spritesheets'),
      prefix: 'collapsed-background',
      jpg_conversion:true,
      quality:80
    }

  },

  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;