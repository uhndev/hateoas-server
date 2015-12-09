// api/services/PermissionService.js

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/dist/api/services/PermissionService');

  /** @namespace */
  function PermissionService () { }

  PermissionService.prototype = Object.create(_super);
  _.extend(PermissionService.prototype, {

    /**
     * findEnrollments
     * @description Given a user with arbitrary group, check for valid enrollments for the given collection centre
     * @memberOf PermissionService
     * @param  {Object}         user req.user object
     * @param  {Object|Integer} centre collection centre object or centre ID
     * @return {Array|Promise}  list of enrollments, or promise
     */
    findEnrollments: function(user, centre) {
      return Group.findOne(user.group).then(function (group) {
        this.group = group;
        switch (group.level) {
          case 1: return null;
          case 2: return UserEnrollment.find({
            user: user.id,
            collectionCentre: centre.id || centre,
            expiredAt: null
          });
          case 3: return Subject.findOne({ user: user.id }).then(function (subject) {
            return SubjectEnrollment.find({
              subject: subject.id,
              collectionCentre: centre.id || centre,
              expiredAt: null
            });
          });
          default: return res.notFound();
        }
      });
    },

    /**
     * filterByEnrollment
     * @description Given a user object and an array collection, filter the collection based
     *              on the enrollments that user holds.
     * @memberOf PermissionService
     * @param   {Object} user
     * @param   {Array}  collection
     * @returns {Array|Promise}
       */
    filterByEnrollment: function(user, collection) {
      var filterCollection = function(user) {
        var validEnrollments = _.filter(user.enrollments, { expiredAt: null });
        return _.filter(collection, function (record) {
          if (_.has(record, 'collectionCentres')) { // check if collection centres has user enrollment
            return _.some(record.collectionCentres, function(centre) {
              return _.includes(_.pluck(validEnrollments, 'collectionCentre'), centre.id);
            });
          } else if (_.has(record, 'collectionCentre')) { // check if user enrollment has collection centre
            return _.includes(_.pluck(validEnrollments, 'collectionCentre'), record.collectionCentre);
          } else {
            return true;
          }
        });
      };

      return Group.findOne(user.group)
        .then(function (group) {
          switch(group.level) {
            case 1: // allow all as admin
              return collection;
            case 2: // find specific user's access
              return User.findOne(user.id).populate('enrollments').then(filterCollection);
            case 3: // find subject's collection centre access
              return Subject.findOne({user: user.id}).populate('enrollments').then(filterCollection);
            default: return null;
          }
        })
        .then(function (filteredCollection) {
          return filteredCollection;
        });
    },

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

