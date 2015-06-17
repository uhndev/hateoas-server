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
  var dadosModels = [
    // access models
    'Role', 'Permission', 'User', 'UserOwner',
    // study administration models
    'Study', 'CollectionCentre', 'Subject', 'WorkflowState', 'Person'
  ];

  _.each(dadosModels, function(model) {
    _.each(crud, function(operation) {
      var permission = {
        action: operation,
        createdBy: admin.id
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
      
      // prevent user create self tautology
      if (model !== 'UserOwner' && operation !== 'create') {
        permissions.push(permission);
      }
    })
  });

  return Promise.all(
    _.map(permissions, function (permission) {
      return Permission.findOrCreate(permission, permission);
    })
  ); 
};