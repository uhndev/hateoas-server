/**
 * Permission
 *
 * @class Permission
 * @description Representation of the actions a Role is granted on a particular Model and its attributes
 * @extends https://github.com/tjwebb/sails-permissions/blob/master/api/models/Permission.js
 */

(function() {
  'use strict';

  var _ = require('lodash');
  var _super = require('sails-permissions/api/models/Permission');

  _.merge(exports, _super);
  _.merge(exports, {

    // Extend with custom logic here by adding additional fields, methods, etc.

  });
})();

