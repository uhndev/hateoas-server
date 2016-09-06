// api/controllers/PermissionController.js

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/api/controllers/PermissionController');

  _.merge(exports, _super);
  _.merge(exports, {

    /**
     * fetchPermissions
     * @description Endpoint for returning permissions data for a given model
     * @param req
     * @param res
     */
    fetchPermissions: function (req, res) {
      var permissionModel = req.param('model');
      return Model.findOne({name: permissionModel})
        .then(function (model) {
          return PermissionService.fetchPermissions(model, req.user);
        })
        .then(function(permissions) {
          // create blacklist dictionary of actions to blacklist array
          var blacklist = _.reduce(permissions, function (result, permission) {
            result[permission.action] = permission.blacklist;
            return result;
          }, {});

          var where = _.reduce(permissions, function (result, permission) {
            result[permission.action] = permission.where;
            return result;
          }, {});

          // create relations dictionary of actions into relations array
          var relations = _.reduce(permissions, function (result, permission) {
            result[permission.action] = permission.relation;
            return result;
          }, {});

          // includes different attributes into the template object
          res.json({
            template: {
              allow: _.pluck(permissions, 'action'),
              blacklist: blacklist,
              where: where,
              relations: relations
            }
          });
        })
        .catch(res.badRequest);
    }

  });
})();
