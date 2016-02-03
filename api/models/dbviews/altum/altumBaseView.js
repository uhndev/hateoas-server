/**
 * altumBaseView
 * @description A virtual model representing a database view.  Inherits baseView to set schemaName.
 */
(function () {
  var _super = require('./../baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    meta: {
      schemaName: 'altum'
    }

  });
})();

