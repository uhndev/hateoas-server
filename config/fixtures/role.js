(function () {
  var Promise = require('bluebird');
  /**
   * Creates default Roles
   *
   * @public
   */
  exports.create = function () {

    return Promise.all([
      Role.findOneByName('altumadmin').then(function (role) {
        if (!role) {
          var permissions = [
            { model: 'systemform',        action: 'read' },
            { model: 'statusform',        action: 'read' },
            { model: 'translation',       action: 'read' },
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
          ];

          var altumPermissions = _.reduce([
            'address', 'altumservice', 'approval', 'approver', 'city', 'client',
            'company', 'emergencycontact', 'employee', 'invoice', 'language',
            'note', 'notetype', 'payor', 'physician', 'prognosis', 'program',
            'programservice', 'referral', 'service', 'servicecategory', 'site',
            'staff', 'stafftype', 'status', 'timeframe', 'workstatus', 'person',
            'altumprogramservices', 'clientcontact', 'referraldetail', 'servicedetail',
            'billinggroup', 'completion', 'billingstatus', 'reportstatus', 'servicepreset'
          ], function (result, model) {
            return result.concat(_.map(['create', 'read', 'update'], function (action) {
              return {
                model: model,
                action: action
              }
            }));
          }, []);

          return PermissionService.createRole({
            name: 'altumadmin',
            permissions: permissions.concat(altumPermissions)
          });
        }
        return role;
      }),
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
