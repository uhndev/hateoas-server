/**
 * Model
 *
 * @class Model
 * @description Abstract representation of a Waterline Model.
 * @extends https://github.com/tjwebb/sails-permissions/blob/master/api/models/Model.js
 */

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/api/models/Model');

  _.merge(exports, _super);
  _.merge(exports, {

    // Extend with custom logic here by adding additional fields, methods, etc.

  });
})();
