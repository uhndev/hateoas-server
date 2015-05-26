// api/services/PermissionService.js

var _ = require('lodash');
var _super = require('sails-permissions/api/services/PermissionService');

function PermissionService () { }

PermissionService.prototype = Object.create(_super);
_.extend(PermissionService.prototype, {

  // Extend with custom logic here by adding additional fields and methods,
  // and/or overriding methods in the superclass.

  checkPermissions: function (req, adminCb, coordinatorCb, interviewerCb, subjectCb, next) {
    Role.findOne(req.permissions[0].role)
      .then(function (role) {
        switch(role.name) {
          case 'admin': adminCb(); break;
          case 'coordinator': coordinatorCb(); break;
          case 'interviewer': interviewerCb(); break;
          default: subjectCb(); break;
        }
      }).catch(next);    
  }
});

module.exports = new PermissionService();
