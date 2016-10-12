# Display Media Standard Previewer

A Gulp based task runner and development server for use with [Standard Media Display Templates](https://github.com/chrisathook/display-standard-template). The Previewer can be installed globally from GitHub and run from any directory via the command line. There are tasks to compile the .scss files to css and compile images into spritesheets. There is also a live server using Browsersync that will automatically recompile and reload when files are edited. See the template readme.md for full documentation on the templates themselves.

## Dependencies

* Node - Globals
    * Gulp 4

## How To Install And Update

`npm install -g https://github.com/chrisathook/display-standard-previewer`

Since this is not an NPM module the same command is used for both install and to update.


## Commands

Once installed the system can be run globally via `display-standard-previewer `. The following commands are supported.


### sass

Compiles the .scss files into .css

### sprite

Compiles all the images in /_toSprite into spritesheets and generates the necessary .scss partials in /sass/spritesheets.

### build

Runs *sprite* then *sass*

### watch

Runs *build* then starts Browsersync server and watches files for changes.

To stop the dev server type `ctrl+c` in the command line window.

### build-dist

Runs *build* then compiles all the source into /_dist with minificaiton.

## Options

### -p

Override the default server port. Default is 8080

### -d

turns on some debug tracing in the window.
