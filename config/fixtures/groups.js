(function () {
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
            { prompt: 'HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { "href": "/assessment", "icon": "fa-stethoscope", "prompt": "Assessments" },
            { prompt: 'HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' },
            { prompt: 'HEADER.MENU.TOOLS', icon: 'fa-cog', dropdown: [
              { prompt: 'HEADER.MENU.FORM_BUILDER', href: '/formbuilder', icon: 'fa-wrench' },
              { prompt: 'HEADER.MENU.WORKFLOW_EDITOR', href: '/workflow', icon: 'fa-code' },
              { prompt: 'HEADER.MENU.GROUPS', href: '/group', icon: 'fa-users'},
              { prompt: 'HEADER.MENU.ACCESS_MANAGEMENT', href: '/access', icon: 'fa-lock'}
            ]},
            {
              "prompt": "Altum Settings",
              "icon": "fa-cog",
              "dropdown": [{"prompt": "Approvers", "href": "/approver", "icon": "fa-male"}, {
                "prompt": "Address",
                "href": "/address",
                "icon": "fa-paw"
              }, {"prompt": "Payor", "href": "/payor", "icon": "fa-bank"}, {
                "prompt": "Claim",
                "href": "/claim",
                "icon": "fa-wheelchair"
              },
                {"prompt": "Work Status", "href": "/workstatus", "icon": "fa-calendar-check-o"},
              {"prompt": "Physician", "href": "/physician", "icon": "fa-stethoscope"},
              {
                "prompt": "Program",
                "href": "/program",
                "icon": "fa-medkit"
              },
                {"prompt": "Status", "href": "/status", "icon": "fa-calandar-check-o"}]
            }
          ],
          subview: [ 'name', 'overview', 'collectioncentre', 'subject', 'user', 'form', 'survey' ]
        }
      },
      {
        name: 'coordinator',
        roles: coordinatorRoles,
        level: 2,
        menu: {
          tabview: [
            { prompt: 'HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user' }
          ],
          subview: [ 'name', 'overview', 'subject', 'user' ]
        }
      },
      {
        name: 'interviewer',
        roles: interviewerRoles,
        level: 2,
        menu: {
          tabview: [
            { prompt: 'HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user' }
          ],
          subview: [ 'name', 'overview', 'subject' ]
        }
      },
      {
        name: 'subject',
        roles: subjectRoles,
        level: 3,
        menu: {
          tabview: [
            { prompt: 'HEADER.MENU.MY_STUDIES', href: '/study', icon: 'fa-group' },
            { prompt: 'HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user' }
          ],
          subview: [ 'name', 'overview' ]
        }
      }
    ];

    return Promise.all(
      _.map(groups, function (group) {
        return Group.findOrCreate({name: group.name}, group);
      })
    );
  };

})
();
