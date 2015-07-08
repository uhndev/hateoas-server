// api/services/PermissionService.js

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/api/services/PermissionService');

  /** @namespace */
  function PermissionService () { }

  PermissionService.prototype = Object.create(_super);
  _.extend(PermissionService.prototype, {

    /**
     * setUserRoles
     * @description On create/updates of user role, set appropriate permissions
     * @memberOf PermissionService
     * @param  {Object}         user
     * @return {Object|Promise} user with updated roles, or promise
     */
    setUserRoles: function(user) {
      var self = this;
      var uID = user.group.id || user.group;
      return Group.findOne(uID).populate('roles')
        .then(function (group) {
          return self.grantPermissions(user, group.roles);
        });
    },

    /**
     * revokeGroupPermissions
     * @description Removes all roles' permissions from a given group
     * @memberOf PermissionService
     * @param  {Object} group
     * @return {group}
     */
    revokeGroupPermissions: function(group) {
      return Group.findOne(group.id).populate('roles')
      .then(function (group) {
        _.each(group.roles, function (role) {
          group.roles.remove(role.id);
        });
        return group.save();
      });
    },

    /**
     * grantPermissions
     * @description Revokes a user's roles, then grants the given roles to a user.
     * @memberOf PermissionService
     * @param  {Object} user
     * @param  {Array}  roles
     * @return {Object} user
     */
    grantPermissions: function(user, roles) {
      return User.findOne(user.id).populate('roles')
      .then(function (user) {
        _.each(user.roles, function (role) {
          user.roles.remove(role.id);
        });
        return user.save();
      })
      .then(function (user) {
        /**
         * Depending on how we're creating or updating this user's roles,
         * either full roles with ids will be passed through, or simply
         * an array of role names (i.e. from access matrix page)
         */
        if (_.all(roles, function (role) { return _.has(role, 'id'); })) {
          _.each(roles, function (role) {
            user.roles.add(role.id);
          });
          return user.save();
        }
        // otherwise, updating from access matrix, will pass role names from frontend
        else {
          return Role.find({name: roles}).then(function (foundRoles) {
            _.each(foundRoles, function (role) {
              user.roles.add(role.id);
            });
            return user.save();
          })
        }
      })
      .catch(function(err) {
        return err;
      });
    }

  });

  module.exports = new PermissionService();
})();

