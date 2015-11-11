/**
 * translate-parse
 * @description Tiny script to parse mongoexport result and overwrite translations
 *              in config/locales with most up-to-date translations from mongoDB.
 */

(function () {
  'use strict';

  var fs = require('fs');
  var exec = require('child_process').exec;
  var cmd = 'mongoexport --db dados-cache --collection translation --jsonArray';

  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      console.error(error);
    } else {
      // parse json file to object
      var jsonArray = JSON.parse(stdout);

      // overwrite locale files
      jsonArray.map(function (translation) {
        var file = ["../../locales/", translation.language, ".json"].join('');
        fs.writeFileSync(file, JSON.stringify(translation.translation, null, 2));
        console.log("Successfully exported " + translation.language + " to " + file);
      });

    }
  });

})();

