// Until @tjwebb makes this process easier, I'm modifying the hook from node_modules/sails-permissions

var modelRestrictions = {
  coordinator: [
    'Permission',
    'Model',
    'WorkflowState'
  ],
  interviewer: [
    'Role',
    'Permission',
    'Model',
    'WorkflowState'    
  ],
  subject: [
    'Role',
    'Permission',
    'Model',
    'WorkflowState'
  ]
};

module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:sails-permissions:loaded', function () {
        Model.count()
          .then(function (count) {
            if (count == sails.models.length) return next();
            initializeRoles()
              .then(initializeCoordinators)
              .then(initializeInterviewers)
              .then(initializeSubjects)
              .then(next);
          })
          .catch(function (error) {
            sails.log.error(error);
            next(error);
          });
      });
    }
  };
};

/**
 * Install the application. Sets up additional Roles and Permissions
 */
function initializeRoles () {
  sails.log('finding or creating roles for coordinators, interviewers and subjects');
  return require('../../config/fixtures/role').create();
}

function initializeCoordinators () {
  return Model.find({ name: { '!': modelRestrictions.coordinator } })
    .then(function (models) {
      this.models = models;
      return Role.find();
    })    
    .then(function (roles) {
      this.roles = roles;
      return User.findOne({ email: sails.config.permissions.adminEmail });
    })
    .then(function (admin) {
      sails.log('setting additional permissions for coordinators');
      return require('../../config/fixtures/coordinator').create(this.roles, this.models, admin);
    })
    .then(function (permissions) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}

function initializeInterviewers () {
  return Model.find({ name: { '!': modelRestrictions.interviewer } })
    .then(function (models) {
      this.models = models;
      return Role.find();
    })    
    .then(function (roles) {
      this.roles = roles;
      return User.findOne({ email: sails.config.permissions.adminEmail });
    })
    .then(function (admin) {
      sails.log('setting additional permissions for interviewers');
      return require('../../config/fixtures/interviewer').create(this.roles, this.models, admin);
    })
    .then(function (permissions) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}

function initializeSubjects () {
  return Model.find({ name: { '!': modelRestrictions.subject } })
    .then(function (models) {
      this.models = models;
      return Role.find();
    })    
    .then(function (roles) {
      this.roles = roles;
      return User.findOne({ email: sails.config.permissions.adminEmail });
    })
    .then(function (admin) {
      sails.log('setting additional permissions for subjects');
      return require('../../config/fixtures/subject').create(this.roles, this.models, admin);
    })
    .then(function (permissions) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}
