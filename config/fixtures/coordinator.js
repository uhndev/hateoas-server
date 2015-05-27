var grants = {
  coordinator: [
    { action: 'create' },
    { action: 'read' },
    { action: 'update' },
    { action: 'delete' }
  ]
};

// TODO let users override this in the actual model definition

/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin) {
  var coordinatorRole = _.find(roles, { name: 'coordinator' });
  var permissions = [
    {
      model: _.find(models, { name: 'Study' }).id,
      action: 'read',
      role: coordinatorRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'Subject' }).id,
      action: 'read',
      role: coordinatorRole,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'read',
      role: coordinatorRole.id,
      createdBy: admin.id,
      relation: 'owner'
    },
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'update',
      role: coordinatorRole.id,
      createdBy: admin.id,
      relation: 'owner'
    },  
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'create',
      role: coordinatorRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'Form' }).id,
      action: 'read',
      role: coordinatorRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'AnswerSet' }).id,
      action: 'create',
      role: coordinatorRole.id,
      createdBy: admin.id
    }    
  ];
  return Promise.all(
    _.map(permissions, function (permission) {
      return Permission.findOrCreate(permission, permission);
    })
  ); 
};