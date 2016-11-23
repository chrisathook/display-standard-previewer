'use strict';
var dest = process.cwd();
var root = process.cwd();
var path = require('path');
module.exports = function (images_path, build_dist_path, js_path) {
  if (images_path === undefined || images_path === 'undefined') {
    images_path = 'images';
  }
  if (build_dist_path === undefined || build_dist_path === 'undefined') {
    build_dist_path = '_dist';
  }
  if (js_path === undefined || js_path === 'undefined') {
    js_path = 'libs';
  }
  return {
    flags: {
      minify: false,
      sourcemap: true,
      type: 'dev'
    },
    clean: {
      src: dest + '/**/*'
    }, reload: {
      src: [
        path.join(root, '/**/index.html'),
        path.join(root, `/${js_path}/**/*.js`),
        path.join(root, `/${images_path}/**/*.{gif,jpg,png,svg}`),
        '!' + path.join(dest, `${build_dist_path}`)
      ]
    },
    html: {
      src: './!(*.fla|*.md)',
      entry: path.join(root, '/index.html'),
      dist: path.join(dest, `${build_dist_path}`)
    },
    sass: {
      src: path.join(root, 'sass/**/style.scss'),
      watch_src: [path.join(root, 'sass/**/*.scss'), path.join(root, '!./sass/spritesheets/**/*.scss')],
      dist: path.join(dest, 'css/')
    },
    sprite: {
      collapsed_foreground: {
        src: path.join(root, '_toSprite/collapsed/foreground/**/*.png'),
        img_root: `${images_path}`,
        dist_img: path.join(dest, `/${images_path}/`),
        dist_img_source: path.join(dest, `/${images_path}/_assets/`),
        dist_css: path.join(root, '/sass/spritesheets'),
        prefix: 'collapsed-foreground',
        jpg_conversion: false,
        quality: 60
      },
      collapsed_background: {
        src: path.join(root, '_toSprite/collapsed/background/**/*.png'),
        img_root: `${images_path}`,
        dist_img: path.join(dest, `/${images_path}/`),
        dist_img_source: path.join(dest, `/${images_path}/_assets/`),
        dist_css: path.join(root, '/sass/spritesheets'),
        prefix: 'collapsed-background',
        jpg_conversion: true,
        quality: 60
      }
    },
    build: {
      clean: {
        src: path.join(dest, `${build_dist_path}`, '/**/*')
      },
      src: [
        path.join(root, `/${images_path}/**/*.{gif,jpg,png,svg}`),
        '!' + path.join(root, `/${images_path}/{_assets,_assets/**}`),
        path.join(root, '/css/**/*.css'),
        path.join(root, '/*manifest.js'), // for FT manifest file
        path.join(root, '/*static-backup.jpg')
      ],
      dist: path.join(dest, `${build_dist_path}`)
    },
    rename_backup: {
      src: path.join(dest, `${build_dist_path}`, '/*static-backup.jpg'),
      dist: path.join(dest, `${build_dist_path}`)
    },
    inline: {
      src: path.join(dest, `${build_dist_path}`, '/index.html'),
      root: path.join(dest, `${build_dist_path}`),
      dist: path.join(dest, `${build_dist_path}`)
    },
    inline_clean: {
      src: path.join(dest, `${build_dist_path}`, '/**/*.css')
    }
    ,
    optimize: {
      css: {
        src: path.join(dest, `${build_dist_path}`, '/**/*.css')
      },
      js: {
        src: [
          path.join(dest, `${build_dist_path}`, '/**/*.js'),
          '!' + path.join(dest, `${build_dist_path}`, '/**/*manifest.js')
        ]
      },
      html: {
        src: path.join(dest, `${build_dist_path}`, '/**/*.html')
      },
      sprite_image: {
              src: [
                path.join(dest, `${build_dist_path}`, '/**/*-sprite.png'),
                path.join(dest, `${build_dist_path}`, '/**/*-sprite.jpg')
              ]
            },
      dist: path.join(dest, `${build_dist_path}`)
    },
    bundle: {
      default: {
        src: [
          path.join(dest, `${build_dist_path}`, '/**/*.*'),
          '!' + path.join(dest, `${build_dist_path}`, '/**/__*.png'),
          '!' + path.join(dest, `${build_dist_path}`, '/**/.*'),
          '!' + path.join(dest, `${build_dist_path}`, '/*.jpg')// exclude static by default
        ],
        base:path.join(dest, `${build_dist_path}`),
        dist: path.join(dest, `${build_dist_path}`),
        meta: path.join(dest, `${build_dist_path}`, '/index.html')
      }
    },
    test: {
      src: path.join(__dirname, 'test-definitions.js')
    }
    ,
    server: {
      root: dest
    }
  };
};