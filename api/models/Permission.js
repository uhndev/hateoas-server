/**
 * Permission
 *
 * @class Permission
 * @description Representation of the actions a Role is granted on a particular Model and its attributes
 * @extends https://github.com/tjwebb/sails-permissions/blob/master/api/models/Permission.js
 */

(function() {
  var _super = require('./BaseModel.js');
  'use strict';

  var _ = require('lodash');
  var _permissions = require('sails-permissions/api/models/Permission');

  _.merge(exports, _super);
  _.merge(exports, _permissions);
  _.merge(exports, {

    // Extend with custom logic here by adding additional fields, methods, etc.

  });
})();

