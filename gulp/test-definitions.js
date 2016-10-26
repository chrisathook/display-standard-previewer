var imageSize = require('image-size');
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');


var root = process.cwd();
var dist = '';

var bannerName = '';

var pathArr = path.resolve(root);
pathArr = pathArr.split(path.sep);
bannerName= pathArr[pathArr.length - 1];

console.log (root);
console.log (bannerName);

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
var htmlPath = path.join(dist, 'index.html');
var html = fs.readFileSync(htmlPath, 'utf8');

var cssPath = path.join(dist,  '/css/style.css');


var $ = cheerio.load(html);

var config = {
  specs: {
    fileSize: NaN, // kilobytes
    numFiles: NaN,
    width: NaN, // px
    height: NaN // px
  }
};


function getSpecs(){
  var metaTags = $('meta');

  metaTags.each(function(i, tag){
    var name = tag.attribs['name'];
    var content = tag.attribs['content'];

    if(!name) return;
    if(name.indexOf('ad.') == -1) return;

    var spec = name.replace('ad.','');
    var value = Number(content) || content;

    if (spec==='size') {

      var dimensions = content.split(',');

      config.specs['width'] =Number( dimensions[0].split ('=')[1])
      config.specs['height'] =Number( dimensions[1].split ('=')[1])
    }else {
      config.specs[spec] = value;
    }




  });

  console.log (config);
}

getSpecs();


describe('bundle size', function() {
  var intendedfileSize = config.specs.fileSize;
  it('should be smaller than ' + intendedfileSize + 'k', function() {



    var zip = fs.statSync(path.join(dist,  bannerName+'.zip'));
    var fileSize = zip['size']/1000;

    expect(fileSize).not.toBeGreaterThan(intendedfileSize);

  });
});
