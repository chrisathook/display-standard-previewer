#!/usr/bin/env node
'use strict';
var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var gulpTasks = require('./gulp');
var nconf = require('nconf');
var opts = {
  logLevel: 2,
  home: '.',
  port: 0,
  debug: false,
  tinypngkey:null
};
var task = "default";
var run = function () {
  opts.home = process.cwd();
  task = parseTask(argv._);
  opts.port = parsePort(argv.p);
  opts.debug = parseDebug(argv);
  if (opts.debug) {
    console.log(opts.debug);
    console.log("Hello World");
    console.log(process.cwd());
    console.log(__filename);
    console.log(__dirname);
    console.log(argv);
  }
  nconf.env()
        .file({file: path.join(path.resolve( __dirname,'../'), 'config.json')    });

  opts.tinypngkey = nconf.get('tinypngkey');


  if (task !== 'set-key') {
    gulpTasks(opts, task)
      .then(function () {
        console.log('resolved')
      })
  } else {

    nconf.set('tinypngkey', argv._[1]);
    nconf.save(function (err) {
      fs.readFile(path.join(path.resolve( __dirname,'../'), 'config.json') , function (err, data) {
        console.dir(JSON.parse(data.toString()))
      });
    });
  }
};
var parseDebug = function (object) {
  if (object.hasOwnProperty('d')) {
    return true
  }
  return false
};
var parsePort = function (value) {
  if (Number.isInteger(value) && value != 0) {
    return value
  }
  return 8080;
};
var parseTask = function (paramArray) {
  if (paramArray.indexOf('watch') !== -1) {
    return 'watch'
  }
  if (paramArray.indexOf('sass') !== -1) {
    return 'sass'
  }
  if (paramArray.indexOf('test') !== -1) {
    return 'test'
  }
  if (paramArray.indexOf('sprite') !== -1) {
    return 'sprite'
  }
  if (paramArray.indexOf('build') !== -1) {
    return 'build'
  }
  if (paramArray.indexOf('build-dist') !== -1) {
    return 'build-dist'
  }
  if (paramArray.indexOf('end-watch') !== -1) {
    return 'end-watch'
  }
  if (paramArray.indexOf('bundle') !== -1) {
    return 'bundle'
  }
  if (paramArray.indexOf('set-key') !== -1) {
    return 'set-key'
  }
  return 'default'
};
run();