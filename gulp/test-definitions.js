var imageSize = require('image-size');
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');


var root = process.cwd();
var dist = '';
try {

  var possible = path.join(root, '_dist');
  fs.accessSync(possible, fs.F_OK);
  dist = possible;
  console.log (dist)
} catch (e) {
  // It isn't accessible
}
try {

  var possible2 = path.join(root, 'dist');
  fs.accessSync(possible2, fs.F_OK);
  dist = possible2;
  console.log (dist)
} catch (e) {
  // It isn't accessible
}
var htmlPath = 'index.html';