(function() {
  var Promise = require('bluebird');

  /**
   * Create default Groups
   */
  exports.create = function (roles, admin) {

    var groups = [
      {
        name: 'admin',
        roles: _.find(roles, { name: 'admin' }).id,
        level: 1,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' },
            { prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL', sref: 'subjectportal.surveys', href: '/subjectportal/surveys', icon: 'fa-arrow-right' },
            { prompt: 'APP.HEADER.MENU.TOOLS', icon: 'fa-cog', dropdown: [
              { prompt: 'APP.HEADER.MENU.FORM_BUILDER', href: '/formbuilder', icon: 'fa-wrench' },
              { prompt: 'APP.HEADER.MENU.WORKFLOW_EDITOR', href: '/workflow', icon: 'fa-code' },
              { prompt: 'APP.HEADER.MENU.GROUPS', href: '/group', icon: 'fa-users'},
              { prompt: 'APP.HEADER.MENU.TRANSLATIONS', href: '/translation', icon: 'fa-globe'},
              { prompt: 'APP.HEADER.MENU.ACCESS_MANAGEMENT', href: '/access', icon: 'fa-lock'}
            ]}
          ],
          subview: {
            'study': ['name', 'study', 'collectioncentre', 'subjectenrollment', 'userenrollment', 'form', 'survey'],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'coordinator',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains([ 'registered', 'coordinator' ], role.name);
        }), 'id'),
        level: 2,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' },
            { prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL', sref: 'subjectportal.surveys', href: '/subjectportal/surveys', icon: 'fa-arrow-right' }
          ],
          subview: {
            'study': [ 'name', 'study', 'collectioncentre', 'subjectenrollment', 'userenrollment' ],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'provider',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains([ 'registered', 'provider' ], role.name);
        }), 'id'),
        level: 2,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' },
            { prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL', sref: 'subjectportal.surveys', href: '/subjectportal/surveys', icon: 'fa-arrow-right' }
          ],
          subview: {
            'study': [ 'name', 'study', 'collectioncentre', 'subjectenrollment', 'userenrollment' ],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'interviewer',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains([ 'registered', 'interviewer' ], role.name);
        }), 'id'),
        level: 2,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user' },
            { prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL', sref: 'subjectportal.surveys', href: '/subjectportal/surveys', icon: 'fa-arrow-right' }
          ],
          subview: {
            'study': [ 'name', 'study', 'subject' ],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'subject',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains([ 'registered', 'subject' ], role.name);
        }), 'id'),
        level: 3,
        menu: {
          tabview: [
            { prompt: 'APP.HEADER.MENU.MY_STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'APP.HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user' },
            { prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL', sref: 'subjectportal.surveys', href: '/subjectportal/surveys', icon: 'fa-arrow-right' }
          ],
          subview: {
            'study': [ 'name', 'study' ],
            'user': ['name', 'user']
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
