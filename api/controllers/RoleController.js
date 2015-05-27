// api/controllers/RoleController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/RoleController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  findRoleUsers: function (req, res, next) {
    var roleName = req.param('name');
    Role.findOne({name: roleName})
      .populate('users')
      .exec(function (err, role) {
        if (err) return next(err);
        res.ok(role.users);
      });
  }
  
});
