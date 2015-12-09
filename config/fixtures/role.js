(function () {
  var Promise = require('bluebird');
  /**
   * Creates default Roles
   *
   * @public
   */
  exports.create = function () {

    return Promise.all([
      Role.findOneByName('coordinator').then(function (role) {
        if (!role) {
          return PermissionService.createRole({
            name: 'coordinator',
            permissions: [
              { model: 'studysubject',      action: 'read' },
              { model: 'subjectschedule',   action: 'read' },
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'user',
                action: 'read',
                criteria: [
                  { where: { group: { '!': 'subject' } } }
                ]
              },
              {
                model: 'user',
                action: 'update',
                relation: 'owner',
                criteria: [
                  {
                    blacklist: ['group']
                  }
                ]
              },
              {
                model: 'user',
                action: 'create',
                criteria: [
                  {
                    blacklist: ['group']
                  }
                ]
              }
            ]
          });
        }
        return role;
      }),
      Role.findOneByName('interviewer').then(function (role) {
        if (!role) {
          return PermissionService.createRole({
            name: 'interviewer',
            permissions: [
              { model: 'studysubject',      action: 'read' },
              { model: 'subjectschedule',   action: 'read' },
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'user',
                action: 'read',
                criteria: [
                  { where: { group: { '!': 'subject' } } }
                ]
              },
              {
                model: 'user',
                action: 'update',
                relation: 'owner',
                criteria: [
                  {
                    blacklist: ['group']
                  }
                ]
              }
            ]
          });
        }
        return role;
      }),
      Role.findOneByName('subject').then(function (role) {
        if (!role) {
          PermissionService.createRole({
            name: 'subject',
            permissions: [
              { model: 'studysubject',      action: 'read' },
              { model: 'schedulesubjects',  action: 'read' },
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'user',
                action: 'read',
                relation: 'owner'
              },
              {
                model: 'user',
                action: 'update',
                relation: 'owner',
                criteria: [
                  {
                    blacklist: ['group']
                  }
                ]
              }
            ]
          });
        }
        return role;
      })
    ]);
  };

})();
