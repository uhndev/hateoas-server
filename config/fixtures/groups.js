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
        'readSurvey',
        'readSubjectSchedule',
        'readUserEnrollment',
        'readUser',
        'readUserOwner',
        'updateUserOwner',
        'createUser',
        'readSystemForm',
        'readForm',
        'readTranslation',
        'createAnswerSet'
      ], role.name);
    }), 'id');

    var interviewerRoles = _.pluck(_.filter(roles, function (role) {
      return _.contains([
        'readStudy',
        'readCollectionCentre',
        'readSubjectEnrollment',
        'readSurvey',
        'readSubjectSchedule',
        'readUserOwner',
        'updateUserOwner',
        'readSystemForm',
        'readForm',
        'readTranslation',
        'createAnswerSet'
      ], role.name);
    }), 'id');

    var subjectRoles = _.pluck(_.filter(roles, function (role) {
      return _.contains([
        'readStudy',
        'readCollectionCentre',
        'readUserOwner',
        'readSystemForm',
        'readForm',
        'readTranslation',
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
            {"href": "/assessment", "icon": "fa-stethoscope", "prompt": "APP.HEADER.MENU.RECOMMENDATIONS"},
            {
              "prompt": "APP.HEADER.MENU.AT", "icon": "fa-cog", "dropdown": [
              {"prompt": "APP.HEADER.MENU.AT.APPROVERS", "href": "/approver", "icon": "fa-male"},
              {"prompt": "APP.HEADER.MENU.AT.ADDRESS", "href": "/address", "icon": "fa-paw" },
              {"prompt": "APP.HEADER.MENU.AT.PAYOR", "href": "/payor", "icon": "fa-bank"},
              {"prompt": "APP.HEADER.MENU.AT.CLAIM", "href": "/claim", "icon": "fa-wheelchair"},
              {"prompt": "APP.HEADER.MENU.AT.WORK_STATUS", "href": "/workstatus", "icon": "fa-calendar-check-o"},
              {"prompt": "APP.HEADER.MENU.AT.PROGNOSIS", "href": "/prognosis", "icon": "fa-check-square"},
              {"prompt": "APP.HEADER.MENU.AT.ALTUMSERVICES", "href": "/altumservice", "icon": "fa-cog" },
              {"prompt": "APP.HEADER.MENU.AT.PROGRAM_SERVICE", "href": "/programservice", "icon": "fa-cog" },
              {"prompt": "APP.HEADER.MENU.AT.SITES", "href": "/site", "icon": "fa-hospital-o" },
              {"prompt": "APP.HEADER.MENU.AT.COMPANY", "href": "/company", "icon": "fa-cog" },
              {"prompt": "APP.HEADER.MENU.AT.PROGRAMS", "href": "/program", "icon": "fa-stethoscope" },
              {"prompt": "APP.HEADER.MENU.AT.PROGRAMSERVICES", "href": "/programservice", "icon": "fa-stethoscope" },
              {"prompt": "APP.HEADER.MENU.AT.SERVICECATEGORIES", "href": "/servicecategory", "icon": "fa-stethoscope" },
              {"prompt": "APP.HEADER.MENU.AT.STATUS", "href": "/status", "icon": "fa-calandar-check-o"}]
            },
            {prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user'},
            {
              prompt: 'APP.HEADER.MENU.TOOLS', icon: 'fa-cog', dropdown: [
              {prompt: 'APP.HEADER.MENU.FORM_BUILDER', href: '/formbuilder', icon: 'fa-wrench'},
              {prompt: 'APP.HEADER.MENU.WORKFLOW_EDITOR', href: '/workflow', icon: 'fa-code'},
              {prompt: 'APP.HEADER.MENU.GROUPS', href: '/group', icon: 'fa-users'},
              {prompt: 'APP.HEADER.MENU.TRANSLATIONS', href: '/translation', icon: 'fa-globe'},
              {prompt: 'APP.HEADER.MENU.ACCESS_MANAGEMENT', href: '/access', icon: 'fa-lock'}
            ]
            }
          ],
        }
      },
      {
        name: 'coordinator',
        roles: coordinatorRoles,
        level: 2,
        menu: {
          tabview: [
            {prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group'},
            {prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user'},
            {
              prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL',
              sref: 'subjectportal',
              href: '/subjectportal',
              icon: 'fa-arrow-right'
            }
          ],
          subview: {
            'study': ['name', 'overview', 'subject', 'user'],
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
            {prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group'},
            {prompt: 'APP.HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user'},
            {
              prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL',
              sref: 'subjectportal',
              href: '/subjectportal',
              icon: 'fa-arrow-right'
            }
          ],
          subview: {
            'study': ['name', 'overview', 'subject'],
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
            {prompt: 'APP.HEADER.MENU.MY_STUDIES', href: '/study', icon: 'fa-group'},
            {prompt: 'APP.HEADER.MENU.MY_PROFILE', href: '/user', icon: 'fa-user'},
            {
              prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL',
              sref: 'subjectportal',
              href: '/subjectportal',
              icon: 'fa-arrow-right'
            }
          ],
          subview: {
            'study': ['name', 'overview'],
            'user': ['name', 'overview']
          }
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
