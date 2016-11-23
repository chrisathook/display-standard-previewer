"use strict";
var imageSize = require('image-size');
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');
var yauzl = require("yauzl");
var colors = require('colors');
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
    staticFileSize: NaN, // kilobytes
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
    } else if (location === 'in.folder') {
      var isInFolder = false;
      try {
        var stats = fs.statSync(path.join(dist, bannerName + '.jpg'));
        isInFolder = true;
      }
      catch (e) {
      }
      expect(isInFolder).toEqual(true);
      done()
    } else if (location === 'in.img') {
      var isInFolder = false;
      try {
        var stats = fs.statSync(path.join(dist, 'img', 'static' + '.jpg'));
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
  it('should be smaller than ' + intendedfileSize + 'k'+' Static Not Counted in .zip weight' , function () {
    var zip = fs.statSync(path.join(dist, bannerName + '.zip'));
    var fileSize = zip['size'] / 1000;
    var location = config.specs.static;
    var staticPath = null;
    if (location === 'in.img') {
      staticPath = path.join(dist, 'img', 'static' + '.jpg');
    } else if (location === 'in.zip') {
      staticPath = path.join(dist, bannerName + '.jpg');
    } else if (location === 'in.folder') {
      staticPath = path.join(dist, bannerName + '.jpg');
    }
    if (location !== 'in.folder') {
      var staticStats = fs.statSync(staticPath);
      var staticFileSize = staticStats['size'] / 1000;
      fileSize = fileSize - staticFileSize
    }
    expect(fileSize).not.toBeGreaterThan(intendedfileSize);
  });
});
describe('static size', function () {
  var intendedfileSize = config.specs.staticFileSize;
  it('should be smaller than ' + intendedfileSize + 'k', function () {
    var location = config.specs.static;
    var staticPath = null;
    if (location === 'in.img') {
      staticPath = path.join(dist, 'img', 'static' + '.jpg');
    } else if (location === 'in.zip') {
      staticPath = path.join(dist, bannerName + '.jpg');
    } else if (location === 'in.folder') {
      staticPath = path.join(dist, bannerName + '.jpg');
    }
    var staticStats = fs.statSync(staticPath);
    var staticFileSize = staticStats['size'] / 1000;
    expect(staticFileSize).not.toBeGreaterThan(config.specs.staticFileSize);
  })
})
describe('static image', function () {
  var width = config.specs.width;
  var height = config.specs.height;
  it('should match dimensions of the creative (' + width + 'x' + height + ')', function () {
    var location = config.specs.static;
    var dimensions = null
    if (location === 'in.img') {
      dimensions = imageSize(path.join(dist, 'img', 'static' + '.jpg'));
    } else {
      dimensions = imageSize(path.join(dist, bannerName + '.jpg'));
    }
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

  function extraAssetCheck() {

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

  function missingAssetCheck() {

    var missingAsset = false;

    var images = [];
    var imagePaths = [];

    // get all images from css
    var regex = /url\s*\(['|"]*([\s\S]*?)["|']*\)/gm;
    var matches = html.match(regex).length;
    while(matches--){
      var match = regex.exec(html)[1];
      var isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
      if(isImage) {
        imagePaths.push(match);
        match = path.join(dist, match);
        images.push(match);
      }
    }

    // get all source references
    regex = / src=['|"]*([\s\S]*?)["|']*(>|\/>|\s)/gm; 
    matches = html.match(regex).length;
    while(matches--){
      var match = regex.exec(html)[1];
      var isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
      if(isImage) {
        imagePaths.push(match);
        match = path.join(dist, match);
        images.push(match);
      }
    }

    images = images.filter(function(elem, index, self) { // remove duplicates
      return index == self.indexOf(elem);
    });

    imagePaths = imagePaths.filter(function(elem, index, self) { // remove duplicates
      return index == self.indexOf(elem);
    });

    for(var i in images){
      var image = images[i];
      var exists = fs.existsSync(image);

      if(exists == false) {
        console.log('\x1b[31m%s\x1b[0m', '!!    missing asset is referenced in HTML or CSS but not in the bundle:');
        console.log('\x1b[31m%s\x1b[0m', String ( imagePaths[i] ));
        missingAsset = true;
      }
    }
    
    return (missingAsset == false)
  }

  //counts the frequency of asset used in compiled html or css
  function count(str, subStr) {
    var matches = str.match(new RegExp(subStr, 'g'));
    return matches ? matches.length : 0;
  }

  it('should have no unused assets', function () {
    expect(extraAssetCheck()).not.toEqual(false);
  });
  it('should have no missing assets', function () {
    expect(missingAssetCheck()).not.toEqual(false);
  });
  it('should have no more than 15 assets', function () {
    expect(assets.length).toBeLessThan(config.specs.numFiles);
  });
  it('should have no http calls', function () {
    expect(count(html, 'http://')).toEqual(0);
  });
});