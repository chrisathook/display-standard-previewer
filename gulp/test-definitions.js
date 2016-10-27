"use strict";
var imageSize = require('image-size');
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');
var yauzl = require("yauzl");
var root = process.cwd();
var dist = '';
var bannerName = '';
var pathArr = path.resolve(root);
pathArr = pathArr.split(path.sep);
bannerName = pathArr[pathArr.length - 1];
//console.log(root);
//console.log(bannerName);
try {
  var possible = path.join(root, '_dist');
  fs.accessSync(possible, fs.F_OK);
  dist = possible;
  // console.log(dist)
} catch (e) {
  // It isn't accessible
}
try {
  var possible2 = path.join(root, 'dist');
  fs.accessSync(possible2, fs.F_OK);
  dist = possible2;
  // console.log(dist)
} catch (e) {
  // It isn't accessible
}
var htmlPath = path.join(dist, 'index.html');
var html = fs.readFileSync(htmlPath, 'utf8');
var $ = cheerio.load(html);
var config = {
  specs: {
    fileSize: NaN, // kilobytes
    numFiles: NaN,
    width: NaN, // px
    height: NaN, // px
    static: ''
  }
};
function getSpecs() {
  var metaTags = $('meta');
  metaTags.each(function (i, tag) {
    var name = tag.attribs['name'];
    var content = tag.attribs['content'];
    if (!name) return;
    if (name.indexOf('bundle.static') !== -1) {
      config.specs['static'] = content;
    }
    if (name.indexOf('ad.') == -1) return;
    var spec = name.replace('ad.', '');
    var value = Number(content) || content;
    if (spec === 'size') {
      var dimensions = content.split(',');
      config.specs['width'] = Number(dimensions[0].split('=')[1])
      config.specs['height'] = Number(dimensions[1].split('=')[1])
    }
    else {
      config.specs[spec] = value;
    }
  });
  // console.log(config);
}
getSpecs();
// tests
describe('static location', function () {
  var location = config.specs.static;
  it('should be located ' + location, function (done) {
    var isInZip = false;
    var onEnd = function () {
      expect(isInZip).toEqual(true);
      done()
    };
    if (location === 'in.zip') {
      yauzl.open(path.join(dist, bannerName + '.zip'), {lazyEntries: true}, function (err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("end", onEnd);
        zipfile.on("entry", function (entry) {
          //console.log('!!!!!', entry.fileName);
          if (entry.fileName === bannerName + '.jpg') {
            isInZip = true;
          }
          zipfile.readEntry();
        });
      });
    } else {
      var isInFolder = false;
      try {
        var stats = fs.statSync(path.join(dist, bannerName + '.jpg'));
        isInFolder = true;
      }
      catch (e) {
      }
      expect(isInFolder).toEqual(true);
      done()
    }
    //
  });
});
describe('bundle size', function () {
  var intendedfileSize = config.specs.fileSize;
  it('should be smaller than ' + intendedfileSize + 'k', function () {
    var zip = fs.statSync(path.join(dist, bannerName + '.zip'));
    var fileSize = zip['size'] / 1000;
    expect(fileSize).not.toBeGreaterThan(intendedfileSize);
  });
});
describe('static image', function () {
  var width = config.specs.width;
  var height = config.specs.height;
  it('should match dimensions of the creative (' + width + 'x' + height + ')', function () {
    var dimensions = imageSize(path.join(dist, bannerName + '.jpg'));
    expect(dimensions.width).toEqual(width);
    expect(dimensions.height).toEqual(height);
  });
});
describe('assets', function () {

  //html build and imgs
  var assets = assetList(dist + '/');

  function assetList(dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = assetList(path.join(dir, file), filelist);
      }
      else {
        filelist.push(file);
      }
    });
    return filelist;
  }

  function assetCheck() {
    var missingReference = false;
    for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      var referenceCount = count(html, asset)
      if (referenceCount < 1 && asset !== '.DS_Store' && asset !== bannerName + '.jpg' && asset !== bannerName + '.zip' && asset !== 'index.html') {
        //notifies the user in the console which assets are not used
        console.log('!!    unused asset:', assets[i]);
        missingReference = true;
      }
    }
    return (missingReference == false)
  }

  //counts the frequency of asset used in compiled html or css
  function count(str, subStr) {
    var matches = str.match(new RegExp(subStr, 'g'));
    return matches ? matches.length : 0;
  }

  it('should reference all assets', function () {
    expect(assetCheck()).not.toEqual(false);
  });
  it('should have no more than 15 assets', function () {
    expect(assets.length).toBeLessThan(config.specs.numFiles);
  });
  it('should have no http calls', function () {
    expect(count(html, 'http://')).toEqual(0);
  });
});