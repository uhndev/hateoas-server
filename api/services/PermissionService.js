// api/services/PermissionService.js

var _ = require('lodash');
var _super = require('sails-permissions/api/services/PermissionService');

function PermissionService () { }

PermissionService.prototype = Object.create(_super);
_.extend(PermissionService.prototype, {

  /**
   * [setUserRoles]
   * On create/updates of user role, set appropriate permissions
   * @param  {Object}         user
   * @return {Object|Promise} user with updated roles, or promise
   */
  setUserRoles: function(user) {
    var promise;
    switch (user.role) {
      case 'admin': 
        promise = this.grantAdminPermissions(user); break;
      case 'coordinator': 
        promise = this.grantCoordinatorPermissions(user); break;
      case 'physician': 
        promise = this.grantPhysicianPermissions(user); break;
      case 'interviewer': 
        promise = this.grantInterviewerPermissions(user); break;
      case 'subject': 
        promise = this.grantSubjectPermissions(user); break;
      default: break;
    }
    return promise;
  },

  /**
   * [grantPermissions] 
   * Revokes a user's roles, then grants the given roles to a user.
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
    .then(function (blankUser) {
      this.user = blankUser;
      return Role.find({ name: roles });
    })
    .then(function (userRoles) {
      _.each(userRoles, function (role) {
        this.user.roles.add(role.id);
      });
      return this.user.save();
    })
    .catch(function(err){
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
      'readUserOwner',
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
      'readUserOwner',
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
