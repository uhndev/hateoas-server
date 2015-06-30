/**
 * @module Criteria
 *
 * @description
 * Criteria specify limits on a permission, via a 'where' clause and an attribute blacklist.
 * For the blacklist, if the request action is update or create, and there is a blacklisted attribute in the request, 
 * the request will fail.  If the request action is read, the blacklisted attributes will be filtered.
 * The blacklist is not relevant for delete requests.
 * A where clause uses waterline query syntax to determine if a permission is allowed, ie where: { id: { '>': 5 } }
 */

var _ = require('lodash');
var _super = require('sails-permissions/api/models/Criteria');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * For example:
   *
   * foo: function (bar) {
   *   bar.x = 1;
   *   bar.y = 2;
   *   return _super.foo(bar);
   * }
   */
});
