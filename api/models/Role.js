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

    /**
     * getQueryLinks
     * @description Provides the query links array in our HATEOAS response; these links
     *              should denote optional queries that can be performed with returned data
     *
     * @param  {Object} user - User object from req.user
     * @return {Array} Array of query links
     */
    getQueryLinks: function(user) {
      return [
        {
          "rel": "default",
          "prompt": "All Roles",
          "href": [sails.config.appUrl + sails.config.blueprints.prefix, 'role'].join('/'),
          "where": null
        },
        {
          "rel": "findByAdmin",
          "prompt": "My Roles",
          "href": [sails.config.appUrl + sails.config.blueprints.prefix, 'role'].join('/'),
          "populate": {
            collection: 'users',
            where: {
              id: user.id
            }
          }
        }
      ];
    },

    attributes: {
      groups: {
        collection: 'group',
        via: 'roles'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();

