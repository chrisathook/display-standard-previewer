# Display Media Standard Previewer

A Gulp based task runner and development server for use with [Standard Media Display Templates](https://github.com/chrisathook/display-standard-template). The Previewer can be installed globally from GitHub and run from any directory via the command line. There are tasks to compile the .scss files to css and compile images into spritesheets. There is also a live server using Browsersync that will automatically recompile and reload when files are edited. See the template readme.md for full documentation on the templates themselves.

## Dependencies

* Node - Globals
    * Gulp 4

### Gulp 4 Install

If you don't have gulp 4 installed globally do the following.

`npm install gulpjs/gulp-cli -g`

`npm install github:gulpjs/gulp#4.0 -g`

## How To Install And Update

`npm install -g https://github.com/chrisathook/display-standard-previewer`

Since this is not an NPM module the same command is used for both install and to update.

## Optional Configuration

The final build step supports using the [Tinypng](https://tinypng.com) API for png optimizaiton of spritesheets. If you want to use that optimization you need to provide the system a API key by running the following command. The key will be saved locally on your machine for future use.

`display-standard-previewer set-key YOUR_KEY_HERE `

## Commands

Once installed the system can be run globally via `display-standard-previewer `. The following commands are supported.


### sass

Compiles the .scss files into .css

### sprite

Compiles all the images in /_toSprite into spritesheets and generates the necessary .scss partials in /sass/spritesheets. Final spritesheets are placed in /images.

### inline-svg

Copies data from all svgs in */_svgs* into */libs/svglib.js* for inclusion in divs in index.html. Svg filename must match target div ID.

### build

Runs *sprite* then *sass*

### watch

Runs *build* then starts Browsersync server and watches files for changes.

To stop the dev server type `ctrl+c` in the command line window.

### build-dist

Runs *build* then compiles all the source into /_dist with minification. If there is a static backup jpg in the root folder, that image will be renamed to the root folder name automatically. Images in */images* and */_toSprite* are not affected.

The .css sheet will be inlined by default when built. If you don't want this feature remove the `inline` param from the CSS <link> tag in the index.html.

The spritesheets images are automatically minified with the TinyPNG api if you have set up an API Key.

### bundle

Bundles contents of */dist* into 1 zip file for upload. Then runs a series of tests to validate the .zip and static.

### tinypng

optimizes the spritesheet images with the TinyPNG API.

## Options

### -p

Override the default server port. Default is 8080

### -d

turns on some debug tracing in the window.
