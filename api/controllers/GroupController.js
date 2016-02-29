/**
 * GroupController
 *
 * @module controllers/GroupController
 * @description Server-side logic for managing groups
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var Promise = require('bluebird');

  module.exports = {

    /**
     * update
     * @description Updates a group's associated roles (only as admin).  Expects an
     *              array of role name strings which will then be found and applied
     *              as new roles to the requested group's permissions.  After applying
     *              new roles, the user is granted the new group's roles.
     */
    update: function (req, res, next) {
      var groupId = req.param('id'),
          menu = req.param('menu'),
          roles = req.param('roles');

      Group.findOne(req.user.group).exec(function (err, group) {
        if (err) return res.serverError(err);

        if (group.level === 1) { // only admins can update groups
          return Group.findOne(groupId).populate('roles').populate('users')
          .then(function (group) {
            this.group = group;
            // roles is a list of rolename strings or role objects, so we
            // need to find ids to add to the groups' roles collection
            roles = (_.all(roles, function(role) { return _.has(role, 'name'); })) ? _.pluck(roles, 'name') : roles;
            return Role.find({ name: roles });
          })
          .then(function (roles) {
            this.roles = roles;
            return PermissionService.revokeGroupPermissions(this.group);
          })
          .then(function () { // apply roles to group
            if (menu) {
              this.group.menu = menu;
            }
            _.each(this.roles, function (role) {
              this.group.roles.add(role.id);
            });
            return this.group.save();
          })
          .then(function (updatedGroup) { // update user roles of updated group
            return Promise.all(
              _.map(this.group.users, function (user) {
                return PermissionService.grantPermissions(user, this.roles);
              })
            );
          })
          .then(function () {
            res.ok(this.group);
          })
          .catch(function (err) {
            return res.serverError(err);
          });
        } else {
          return res.forbidden();
        }
      });
    }

  };

})();
