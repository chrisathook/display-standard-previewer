#!/usr/bin/env node
'use strict';
var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var gulpTasks = require('./gulp');


var opts = {
  logLevel: 2,
  home: '.'
};
var task = "default";
var run = function () {
  console.log("Hello World");
  console.log(process.cwd());
  console.log(__filename);
  console.log(__dirname);
  console.log(argv);
  opts.home = process.cwd();


  task = parseTask(argv._);

  gulpTasks(opts, task)
    .then(function () {
      console.log('resolved')
    })
};
var parseTask = function (paramArray) {
  if (paramArray.indexOf('watch') !== -1) {
    return 'watch'
  }
  if (paramArray.indexOf('sass') !== -1) {
    return 'sass'
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

  return 'default'
};
run();