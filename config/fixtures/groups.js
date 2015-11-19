(function() {
  var Promise = require('q');
  /**
   * Create default Role permissions
   */
  exports.create = function (roles, models, admin) {

    var coordinatorRoles = _.pluck(_.filter(roles, function (role) {
      return _.contains([
        'readStudy',
        'readCollectionCentre',
        'readSubjectEnrollment',
        'readUserEnrollment',
        'readUser',
        'readUserOwner',
        'updateUserOwner',
        'createUser',
        'readSystemForm',
        'readForm',
        'createAnswerSet'
      ], role.name);
    }), 'id');

    var interviewerRoles = _.pluck(_.filter(roles, function (role) {
      return _.contains([
        'readStudy',
        'readCollectionCentre',
        'readSubjectEnrollment',
        'readUserOwner',
        'updateUserOwner',
        'readSystemForm',
        'readForm',
        'createAnswerSet'
      ], role.name);
    }), 'id');

    var subjectRoles = _.pluck(_.filter(roles, function (role) {
      return _.contains([
        'readStudy',
        'readUserOwner',
        'readSystemForm',
        'readForm',
        'createAnswerSet'
      ], role.name);
    }), 'id');

    var groups = [
      {
        name: 'admin',
        roles: _.pluck(roles, 'id'),
        level: 1,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' },
            { prompt: 'APP.HEADER.MENU.TOOLS', icon: 'fa-cog', dropdown: [
              { prompt: 'APP.HEADER.MENU.FORM_BUILDER', href: '/formbuilder', icon: 'fa-wrench' },
              { prompt: 'APP.HEADER.MENU.WORKFLOW_EDITOR', href: '/workflow', icon: 'fa-code' },
              { prompt: 'APP.HEADER.MENU.GROUPS', href: '/group', icon: 'fa-users'},
              { prompt: 'APP.HEADER.MENU.TRANSLATIONS', href: '/translation', icon: 'fa-globe'},
              { prompt: 'APP.HEADER.MENU.ACCESS_MANAGEMENT', href: '/access', icon: 'fa-lock'}
            ]}
          ],
          subview: {
            'study': ['name', 'overview', 'collectioncentre', 'subject', 'user', 'form', 'survey'],
            'user': ['name', 'overview']
          }
        }
      },
      {
        name: 'coordinator',
        roles: coordinatorRoles,
        level: 2,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' }
          ],
          subview: {
            'study': [ 'name', 'overview', 'subject', 'user' ],
            'user': ['name', 'overview']
          }
        }
      },
      {
        name: 'interviewer',
        roles: interviewerRoles,
        level: 2,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user' }
          ],
          subview: {
            'study': [ 'name', 'overview', 'subject' ],
            'user': ['name', 'overview']
          }
        }
      },
      {
        name: 'subject',
        roles: subjectRoles,
        level: 3,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.MY_STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user' }
          ],
          subview: {
            'study': [ 'name', 'overview' ],
            'user': ['name', 'overview']
          }
        }
      }
    ];

    return Promise.all(
      _.map(groups, function (group) {
        return Group.findOrCreate({ name: group.name }, group);
      })
    );
  };

})();
