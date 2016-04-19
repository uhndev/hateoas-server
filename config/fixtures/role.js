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
              { model: 'schedulesubjects',  action: 'read' },
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'group',
                action: 'read',
                criteria: [
                  {
                    where: { level: 2 }
                  }
                ]
              },
              {
                model: 'user',
                action: 'read',
                criteria: [
                  {
                    where: { group: { '!': 'subject' } }
                  }
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
                    where: { group: { '!': 'admin' } }
                  }
                ]
              }
            ]
          });
        }
        return role;
      }),
      Role.findOneByName('provider').then(function (role) {
        if (!role) {
          return PermissionService.createRole({
            name: 'provider',
            permissions: [
              { model: 'studysubject',      action: 'read' },
              { model: 'schedulesubjects',  action: 'read' },
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'group',
                action: 'read',
                criteria: [
                  {
                    where: { level: 2 }
                  }
                ]
              },
              {
                model: 'user',
                action: 'read',
                criteria: [
                  {
                    where: { group: { '!': 'subject' } }
                  }
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
                    where: { group: { '!': 'admin' } }
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
              { model: 'schedulesubjects',  action: 'read' },
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'group',
                action: 'read',
                criteria: [
                  {
                    where: { level: 2 }
                  }
                ]
              },
              {
                model: 'user',
                action: 'read',
                criteria: [
                  {
                    where: { group: { '!': 'subject' } }
                  }
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
          return PermissionService.createRole({
            name: 'subject',
            permissions: [
              { model: 'systemform',        action: 'read' },
              { model: 'form',              action: 'read' },
              { model: 'translation',       action: 'read' },
              { model: 'answerset',         action: 'create' },
              {
                model: 'group',
                action: 'read',
                criteria: [
                  {
                    where: { level: 3 }
                  }
                ]
              },
              {
                model: 'user',
                action: 'read',
                relation: 'owner',
                criteria: [
                  {
                    blacklist: ['group']
                  }
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
      })
    ]);
  };

})();
