/**
 * You're going to need to do `npm install uglify-js` first in order to use
 * this script.
 *
 * @license see /LICENSE
 */
var UglifyJS = require("uglify-js");
var FS = require('fs');

function minifyAll() {
  var result = UglifyJS.minify (

    // files
    [
    "../libs/raf.js",
    "../libs/tween.js",

    "../scripts/misc/namespace.js",
    "../scripts/misc/colors.js",
    "../scripts/misc/namespace.js",

    "../scripts/model/base.js",
    "../scripts/model/settings.js",
    "../scripts/model/user.js",

    "../scripts/view/base.js",
    "../scripts/view/intro.js",
    "../scripts/view/dial.js",
    "../scripts/view/dialentry.js",
    "../scripts/view/main.js",
    "../scripts/view/ticker.js",
    "../scripts/view/weightentry.js",
    "../scripts/view/heightentry.js",
    "../scripts/view/settings.js",
    "../scripts/view/message.js",

    "../scripts/app.js",

    "../scripts/controller/base.js",
    "../scripts/controller/intro.js",
    "../scripts/controller/main.js",
    "../scripts/controller/weightentry.js",
    "../scripts/controller/settings.js",
    "../scripts/controller/message.js",

    "../scripts/misc/bootstrap.js"
    ]
  );

  var license = FS.readFileSync('../LICENSE').toString('utf8');
  result.code = license + result.code;

  FS.writeFileSync('../libs/wt.min.js', result.code);
}

function updateManifest() {
  var manifest = FS.readFileSync('../cache.manifest').toString('utf8');
  var versionNumRegExp = /:v(\d{0,})/;
  var versionNumMatches = versionNumRegExp.exec(manifest);
  var newVersionNum = parseInt(versionNumMatches[1], 10) + 1;
  manifest = manifest.replace(versionNumRegExp, ":v" + newVersionNum);
  FS.writeFileSync('../cache.manifest', manifest);
}

minifyAll();
updateManifest();
