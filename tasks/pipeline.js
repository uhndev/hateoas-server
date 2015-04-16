/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */


// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'src/less/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  // 'vendor/sails.io.js/dist/sails.io.js',

  // Dependencies like jQuery, or Angular are brought in here
  // 'vendor/lodash/dist/lodash.js',
  // 'vendor/lodash-contrib/dist/lodash-contrib.js',
  // 'vendor/jquery/jquery.js',
  // 'vendor/jquery-ui/ui/minified/jquery-ui.js',
  // 'vendor/angular/angular.js',
  // 'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.js',
  // 'vendor/angular-loader/angular-loader.js',
  // 'vendor/angular-resource/angular-resource.js',
  // 'vendor/angular-cookies/angular-cookies.js',
  // 'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
  // 'vendor/angular-resource/angular-resource.js',
  // 'vendor/angular-sails/dist/angular-sails.js',
  // 'vendor/ace-builds/src-min-noconflict/ace.js',
  // 'vendor/ace-builds/src-min-noconflict/mode-javascript.js',
  // 'vendor/ace-builds/src-min-noconflict/worker-javascript.js',
  // 'vendor/angular-ui-ace/ui-ace.js',
  // 'vendor/angular-ui-utils/ui-utils.js',
  // 'vendor/angular-ui-sortable/sortable.js',
  // 'vendor/angular-ui-router/release/angular-ui-router.js',
  // 'vendor/ng-table/ng-table.js',

  // plugins
  // 'vendor/JSONedit/js/JSONEdit.js',
  // 'vendor/ngform-builder/dist/ngform-builder.js',
  // 'vendor/nglist-editor/dist/nglist-editor.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  // 'src/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  // 'src/app/**/*.tpl.html',
  // 'src/common/**/*.tpl.html'
];

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
