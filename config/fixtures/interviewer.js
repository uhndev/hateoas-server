// TODO let users override this in the actual model definition

/**
 * Create default Role permissions
 */
exports.create = function (roles, models, admin) {
  var interviewerRole = _.find(roles, { name: 'interviewer' });
  var permissions = [
    {
      model: _.find(models, { name: 'Study' }).id,
      action: 'read',
      role: interviewerRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'Subject' }).id,
      action: 'read',
      role: interviewerRole.id,
      createdBy: admin.id
    },    
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'read',
      role: interviewerRole.id,
      createdBy: admin.id,
      relation: 'owner' 
    },
    {
      model: _.find(models, { name: 'User' }).id,
      action: 'update',
      role: interviewerRole.id,
      createdBy: admin.id,
      relation: 'owner' 
    },    
    {
      model: _.find(models, { name: 'Form' }).id,
      action: 'read',
      role: interviewerRole.id,
      createdBy: admin.id
    },
    {
      model: _.find(models, { name: 'AnswerSet' }).id,
      action: 'create',
      role: interviewerRole.id,
      createdBy: admin.id
    }    
  ];
  return Promise.all(
    _.map(permissions, function (permission) {
      return Permission.findOrCreate(permission, permission);
    })
  );  
};