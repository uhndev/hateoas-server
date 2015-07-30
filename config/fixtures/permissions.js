(function () {
  var Promise = require('q');
  /**
   * Maps crud x dadosModel permission creations for each default role
   * @param  {Array}  roles
   * @param  {Array}  models
   * @param  {Object} admin
   * @return {Array}
   */
  exports.create = function (roles, models, admin) {

    var permissions = [];
    var crud = ['create', 'read', 'update', 'delete'];
    var dadosModels = _.pluck(models, 'name');
    dadosModels.push('UserOwner');

    _.each(dadosModels, function(model) {
      _.each(crud, function(operation) {
        var permission = {
          action: operation
        };

        // special case for user modifying self permissions
        if (model === 'UserOwner') {
          permission.relation = 'owner';
          permission.model = _.find(models, { name: 'User' }).id;
          permission.role = _.find(roles, { name: operation + 'UserOwner'}).id;
        } else {
          permission.model = _.find(models, { name: model }).id;
          permission.role = _.find(roles, { name: operation + model}).id;
        }

        permissions.push(permission);
      })
    });

    // prevent user create self tautology
    permissions = _.reject(permissions, {relation: 'owner', action: 'create'});

    return Promise.all(
      _.map(permissions, function (permission) {
        return Permission.findOrCreate(permission, permission);
      })
    );
  };

})();
