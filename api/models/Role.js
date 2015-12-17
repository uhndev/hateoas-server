/**
 * Role
 *
 * @class Role
 * @description Roles endow Users with Permissions. Exposes Postgres-like API for
 *              resolving granted Permissions for a User.
 * @extends https://github.com/tjwebb/sails-permissions/blob/master/api/models/Role.js
 */


(function() {
  var _super = require('./BaseModel.js');

  var _ = require('lodash');
  var _role = require('sails-permissions/dist/api/models/Role');

  _.merge(exports, _super);
  _.merge(exports, _role);
  _.merge(exports, {

    // Extend with custom logic here by adding additional fields, methods, etc.

    attributes: {
      groups: {
        collection: 'group',
        via: 'roles'
      }
    }
  });
})();

