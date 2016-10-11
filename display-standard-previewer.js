#!/usr/bin/env node
'use strict';
var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

var opts = {
	logLevel: 2,
  home:'.'
};

var homeDir = '';



var run = function (){

  console.log ("Hello World");
  console.log (process.cwd());
  console.log (__filename );
  console.log (__dirname );
  console.log(argv);


  opts.home = process.cwd();

};


run();