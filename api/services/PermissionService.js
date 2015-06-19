// api/services/PermissionService.js

var _ = require('lodash');
var _super = require('sails-permissions/api/services/PermissionService');

function PermissionService () { }

PermissionService.prototype = Object.create(_super);
_.extend(PermissionService.prototype, {

  /**
   * Removes all roles from the given user.
   * @param  {Object} user 
   * @return {Object} user
   */
  revokeRoles: function(user) {
    return User.findOne(user.id).populate('roles')
      .then(function (user) {
        _.each(user.roles, function (role) {
          user.remove(role.id);          
        });
        return user.save();
      }).catch(function (err) {
        return err;
      });
  },

  /**
   * On create/updates of user role, set appropriate permissions
   * @param {Object}   user
   */
  setUserRoles: function(user) {
    switch (user.role) {
      case 'admin': 
        return this.grantAdminPermissions(user); break;
      case 'coordinator': 
        return this.grantCoordinatorPermissions(user); break;
      case 'physician': 
        return this.grantPhysicianPermissions(user); break;
      case 'interviewer': 
        return this.grantInterviewerPermissions(user); break;
      case 'subject': 
        return this.grantSubjectPermissions(user); break;
      default: break;
    }

    return null;
  },

  /**
   * Revokes a user's roles, then grants the given roles to a user.
   * @param  {Object} user  
   * @param  {Array}  roles 
   * @return {null}       
   */
  grantPermissions: function(user, roles) {
    return this.revokeRoles(user)
    .then(function (blankUser) {
      this.user = blankUser;
      return Role.find({ name: roles });
    })
    .then(function (userRoles) {
      _.each(userRoles, function (role) {
        role.users.add(user.id);
        role.save();
      });
    })
    .catch(function (err) {
      return err;
    });
  },

  grantAdminPermissions: function (user) {
    return this.grantPermissions(user, ['admin']);
  },

  grantCoordinatorPermissions: function(user) {
    var coordinatorRoles = [
      'readStudy',
      'readSubject',
      'readUser',
      'updateUserOwner',
      'createUser',
      'readForm',
      'createAnswerSet'
    ];
    return this.grantPermissions(user, coordinatorRoles);
  },

  grantPhysicianPermissions: function(user) {
    var physicianRoles = [
      'readStudy',
      'readSubject',
      'readUser',
      'updateUserOwner',
      'readForm',
      'createAnswerSet'
    ];
    return this.grantPermissions(user, physicianRoles);
  },

  grantInterviewerPermissions: function(user) {
    var interviewerRoles = [
      'readStudy',
      'readSubject',
      'readUserOwner',
      'updateUserOwner',
      'readForm',
      'createAnswerSet'
    ];
    return this.grantPermissions(user, interviewerRoles);
  },

  grantSubjectPermissions: function(user) {
    var subjectRoles = [
      'readStudy',
      'readUserOwner',
      'readForm',
      'createAnswerSet'
    ];
    return this.grantPermissions(user, subjectRoles);
  }
  
});

module.exports = new PermissionService();
