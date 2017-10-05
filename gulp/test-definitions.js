"use strict";
let imageSize = require('image-size');
let fs = require('fs');
let cheerio = require('cheerio');
let path = require('path');
let yauzl = require("yauzl");
let colors = require('colors');
let glob = require('glob-promise');
let _ = require('lodash');
let root = process.cwd();
let dist = '';
let bannerName = '';
let pathArr = path.resolve(root);
let jsScanPath = null;
pathArr = pathArr.split(path.sep);
bannerName = pathArr[pathArr.length - 1];
//console.log(root);
//console.log(bannerName);
try {
  let possible = path.join(root, '_dist');
  fs.accessSync(possible, fs.F_OK);
  dist = possible;
  jsScanPath = path.join(root, '_dist','combined.js');
  // console.log(dist)
} catch (e) {
  // It isn't accessible
}
try {
  let possible2 = path.join(root, 'dist');
  fs.accessSync(possible2, fs.F_OK);
  dist = possible2;
  jsScanPath = path.join(root, 'dist','combined.js');
  // console.log(dist)
} catch (e) {
  // It isn't accessible
}






let htmlPath = path.join(dist, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

let combinedJS = fs.readFileSync(jsScanPath, 'utf8');

let $ = cheerio.load(html);
let config = {
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
  let metaTags = $('meta');
  metaTags.each(function (i, tag) {
    let name = tag.attribs['name'];
    let content = tag.attribs['content'];
    if (!name) return;
    if (name.indexOf('bundle.static') !== -1) {
      config.specs['static'] = content;
    }
    if (name.indexOf('ad.') == -1) return;
    let spec = name.replace('ad.', '');
    let value = Number(content) || content;
    if (spec === 'size') {
      let dimensions = content.split(',');
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
  let location = config.specs.static;
  it('should be located ' + location, function (done) {
    let isInZip = false;
    let onEnd = function () {
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
      let isInFolder = false;
      try {
        let stats = fs.statSync(path.join(dist, bannerName + '.jpg'));
        isInFolder = true;
      }
      catch (e) {
      }
      expect(isInFolder).toEqual(true);
      done()
    } else if (location === 'in.img') {
      let isInFolder = false;
      try {
        let stats = fs.statSync(path.join(dist, 'img', 'static' + '.jpg'));
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
  let intendedfileSize = config.specs.fileSize;
  it('should be smaller than ' + intendedfileSize + 'k' + ' Static Not Counted in .zip weight', function () {
    let zip = fs.statSync(path.join(dist, bannerName + '.zip'));
    let fileSize = zip['size'] / 1000;
    let location = config.specs.static;
    let staticPath = null;
    if (location === 'in.img') {
      staticPath = path.join(dist, 'img', 'static' + '.jpg');
    } else if (location === 'in.zip') {
      staticPath = path.join(dist, bannerName + '.jpg');
    } else if (location === 'in.folder') {
      staticPath = path.join(dist, bannerName + '.jpg');
    }
    if (location !== 'in.folder') {
      let staticStats = fs.statSync(staticPath);
      let staticFileSize = staticStats['size'] / 1000;
      fileSize = fileSize - staticFileSize
    }
    expect(fileSize).not.toBeGreaterThan(intendedfileSize);
  });
});
describe('Spritesheet PNGs', function () {
  it('should have dimensions that are a multiple of 4', function () {
    let intendedfileSize = config.specs.fileSize;
    let pngDir = path.join(root, '_toSprite');
    let images = assetList(pngDir).filter(function (e) {
      return e.indexOf('.png') != -1
    });
    let badImages = images.filter(function (e) {
      let dimensions = imageSize(e);
      if (dimensions.width % 4 != 0 || dimensions.height % 4 != 0) {
        let goodW = Math.ceil(dimensions.width / 4) * 4;
        let goodH = Math.ceil(dimensions.height / 4) * 4;
        console.log('!!    wrong dimensions:', e);
        console.log('!!    is: ' + dimensions.width + 'x' + dimensions.height);
        console.log('!!    should be: ' + goodW + 'x' + goodH);
        return true;
      }
    });
    
    function assetList(dir, filelist) {
      let files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = assetList(path.join(dir, file), filelist);
        }
        else {
          filelist.push(path.join(dir, file));
        }
      });
      return filelist;
    }
    
    expect(badImages.length).toEqual(0);
  });
});
describe('static size', function () {
  let intendedfileSize = config.specs.staticFileSize;
  it('should be smaller than ' + intendedfileSize + 'k', function () {
    let location = config.specs.static;
    let staticPath = null;
    if (location === 'in.img') {
      staticPath = path.join(dist, 'img', 'static' + '.jpg');
    } else if (location === 'in.zip') {
      staticPath = path.join(dist, bannerName + '.jpg');
    } else if (location === 'in.folder') {
      staticPath = path.join(dist, bannerName + '.jpg');
    }
    let staticStats = fs.statSync(staticPath);
    let staticFileSize = staticStats['size'] / 1000;
    expect(staticFileSize).not.toBeGreaterThan(config.specs.staticFileSize);
  })
});
describe('static image', function () {
  let width = config.specs.width;
  let height = config.specs.height;
  it('should match dimensions of the creative (' + width + 'x' + height + ')', function () {
    let location = config.specs.static;
    let dimensions = null
    if (location === 'in.img') {
      dimensions = imageSize(path.join(dist, 'img', 'static' + '.jpg'));
    } else {
      dimensions = imageSize(path.join(dist, bannerName + '.jpg'));
    }
    expect(dimensions.width).toEqual(width);
    expect(dimensions.height).toEqual(height);
  });
});

describe('svg ID test', function () {
  let src = path.join(root, '_svgs', '/**/*.svg');
  let allClasses = [];
  it('no SVG IDs should be duplicates must be GLOBAL UNIQUE ', function () {
    let files = glob.sync(src);
    files.forEach(function (file) {
      
      // inventory of all styles in each file
      let inventory = {};
      inventory.file = file;
      let content = fs.readFileSync(file, 'utf8');
      let matches = [];
      try {
        
        matches = content.match(/id\=\"(.*?)\"/g);
      } catch (err) {
      }
      let trimmed = [];
      matches.forEach(function (match) {
        trimmed.push(match.replace('.', '').replace('{', ''))
      });
      inventory.classMatches = trimmed;
      allClasses.push(inventory);
    });
    let classCollection = [];
    allClasses.forEach(function (inventory) {
      classCollection = _.concat(classCollection, inventory.classMatches);
    });
    let duplicates = _.filter(classCollection, function (value, index, iteratee) {
      return _.includes(iteratee, value, index + 1);
    });
    duplicates = duplicates.sort();
    duplicates.forEach(function (dupe) {
      console.warn('!! SVG IDs DUPLICATE ERROR', dupe);
      allClasses.forEach(function (svg) {
        svg.classMatches.forEach(function (cssClass) {
          if (cssClass === dupe) {
            console.warn('\x1b[33m%s\x1b[0m', 'Appears In '+ path.relative(root, svg.file));
          }
        })
      })
    })
    expect(duplicates.length).toEqual(0);
  })
});



describe('svg css test', function () {
  let src = path.join(root, '_svgs', '/**/*.svg');
  let allClasses = [];
  it('no SVG CSS classes should be duplicates must be GLOBAL UNIQUE ', function () {
    let files = glob.sync(src);
    files.forEach(function (file) {
      
      // inventory of all styles in each file
      let inventory = {};
      inventory.file = file;
      let content = fs.readFileSync(file, 'utf8');
      let matches = [];
      try {
        let style = content.split('<style type="text/css">')[1].split('</style>')[0];
        matches = style.match(/\.(.*?){/g);
      } catch (err) {
      }
      let trimmed = [];
      matches.forEach(function (match) {
        trimmed.push(match.replace('.', '').replace('{', ''))
      });
      inventory.classMatches = trimmed;
      allClasses.push(inventory);
    });
    let classCollection = [];
    allClasses.forEach(function (inventory) {
      classCollection = _.concat(classCollection, inventory.classMatches);
    });
    let duplicates = _.filter(classCollection, function (value, index, iteratee) {
      return _.includes(iteratee, value, index + 1);
    });
    duplicates = duplicates.sort();
    duplicates.forEach(function (dupe) {
      console.warn('!! SVG CSS CLASS DUPLICATE ERROR', dupe);
      allClasses.forEach(function (svg) {
        svg.classMatches.forEach(function (cssClass) {
          if (cssClass === dupe) {
            console.warn('\x1b[31m%s\x1b[0m', 'Appears In '+ path.relative(root, svg.file));
          }
        })
      })
    })
    expect(duplicates.length).toEqual(0);
  })
});
describe('assets', function () {
  
  //html build and imgs
  let assets = assetList(dist + '/');
  
  function assetList(dir, filelist) {
    let files = fs.readdirSync(dir);
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
    let missingReference = false;
    for (let i = 0; i < assets.length; i++) {
      let asset = assets[i];
      
      let combined = html + combinedJS;
      
      let referenceCount = count(combined, asset);
      if (referenceCount < 1 && asset !== '.DS_Store' && asset !== bannerName + '.jpg' && asset !== bannerName + '.zip' && asset !== 'index.html') {
        //notifies the user in the console which assets are not used
        console.log('!!    unused asset:', assets[i]);
        missingReference = true;
      }
    }
    
    
    
    
    
    
    return (missingReference == false)
  }
  
  function missingAssetCheck() {
    let missingAsset = false;
    let images = [];
    let imagePaths = [];
    // get all images from css
    let regex = /url\s*\(['|"]*([\s\S]*?)["|']*\)/gm;
    let matches = 0;
    try {
      matches = html.match(regex).length;
    } catch (err) {
      console.log('!!!! no images', matches)
    }
    while (matches--) {
      let match = regex.exec(html)[1];
      let isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
      if (isImage) {
        imagePaths.push(match);
        match = path.join(dist, match);
        images.push(match);
      }
    }
    // get all source references
    regex = / src=['|"]*([\s\S]*?)["|']*(>|\/>|\s)/gm;
    matches = html.match(regex).length;
    while (matches--) {
      let match = regex.exec(html)[1];
      let isImage = match.indexOf('.gif') > -1 || match.indexOf('.jpg') > -1 || match.indexOf('.png') > -1 || match.indexOf('.svg') > -1;
      if (isImage) {
        imagePaths.push(match);
        match = path.join(dist, match);
        images.push(match);
      }
    }
    images = images.filter(function (elem, index, self) { // remove duplicates
      return index == self.indexOf(elem);
    });
    imagePaths = imagePaths.filter(function (elem, index, self) { // remove duplicates
      return index == self.indexOf(elem);
    });
    for (let i in images) {
      let image = images[i];
      let exists = fs.existsSync(image);
      if (exists == false) {
        console.log('\x1b[31m%s\x1b[0m', '!!    missing asset is referenced in HTML or CSS but not in the bundle:');
        console.log('\x1b[31m%s\x1b[0m', String(imagePaths[i]));
        missingAsset = true;
      }
    }
    return (missingAsset == false)
  }
  
  //counts the frequency of asset used in compiled html or css
  function count(str, subStr) {
    let matches = str.match(new RegExp(subStr, 'g'));
    try {
      return matches ? matches.length : 0;
    } catch (err) {
      return 0;
    }
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