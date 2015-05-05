var grants = {
  coordinator: [
    { action: 'create' },
    { action: 'read' },
    { action: 'update' },
    { action: 'delete' }
  ],
  subject: [
    { action: 'create' },
    { action: 'read' }
  ]
};

// TODO let users override this in the actual model definition

/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin) {
  return Promise.all([
    grantCoordinatorPermissions(roles, models, admin),
    grantSubjectPermissions(roles, models, admin),
    revokeRegisteredPermissions(roles, models, admin)
  ])
  .then(function (permissions) {
    //sails.log('created', permissions.length, 'permissions');
    return permissions;
  });
};

function grantCoordinatorPermissions (roles, models, admin) {
  var coordinatorRole = _.find(roles, { name: 'coordinator' });
  var permissions = _.flatten(_.map(models, function (modelEntity) {
    var model = sails.models[modelEntity.identity];

    return _.map(grants.coordinator, function (permission) {
      var newPermission = {
        model: modelEntity.id,
        action: permission.action,
        role: coordinatorRole.id,
        createdBy: admin.id
      };
      return Permission.findOrCreate(newPermission, newPermission);
    });
  }));

  return Promise.all(permissions);
}

function grantSubjectPermissions (roles, models, admin) {
  var subjectRole = _.find(roles, { name: 'subject' });
  var permissions = [
    {
      model: _.find(models, { name: 'Study' }).id,
      action: 'read',
      role: subjectRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'read',
      role: subjectRole.id,
      createdBy: admin.id,
      relation: 'owner'   
    },
    {
      model: _.find(models, { name: 'Form' }).id,
      action: 'read',
      role: subjectRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'AnswerSet' }).id,
      action: 'create',
      role: subjectRole.id,
      createdBy: admin.id
    }
  ];

  return Promise.all(
    _.map(permissions, function (permission) {
      return Permission.findOrCreate(permission, permission);
    })
  );
}

function revokeRegisteredPermissions (roles, models, admin) {
  Role.findOne({ name: 'registered' })
    .then(function (role) {
      this.role = role;
      return Model.findOne({ name: 'User' });
    })
    .then(function (model) {
      return Permission.destroy({
        model: model.id,
        action: 'update',
        role: role.id,
      });
    })
    .then(function () {
      sails.log('revoked "update" from "registered" on "User"');
    })
    .catch(sails.log.error);
}