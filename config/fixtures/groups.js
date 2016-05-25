(function () {
  var Promise = require('bluebird');

  /**
   * Create default Groups
   */
  exports.create = function (roles, admin) {
    var groups = [
      {
        name: 'admin',
        roles: _.find(roles, {name: 'admin'}).id,
        level: 1,
        menu: {
          tabview: [
            {"href": "/client", "icon": "fa-users", "prompt": "APP.HEADER.MENU.CLIENTS"},
            {"href": "/referral", "icon": "fa-ambulance", "prompt": "APP.HEADER.MENU.REFERRALS"},
            {"href": "/user", "icon": "fa-user", "prompt": "APP.HEADER.MENU.USER_MANAGER"},
            {
              "prompt": "APP.HEADER.MENU.ALTUM_TOOLS", "icon": "fa-wrench", "dropdown": [
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.ALTUM_SERVICES", "href": "/altumservice", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.APPROVERS", "href": "/approver", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.CLAIMS", "href": "/claim", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.COMPANIES", "href": "/company", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PAYORS", "href": "/payor", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PHYSICIANS", "href": "/physician", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PROGRAM_SERVICES", "href": "/programservice", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.SITES", "href": "/site", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.STAFF", "href": "/staff", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PROGRAMS", "href": "/program", "icon": ""},
                {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.SERVICE_VARIATIONS", "href": "/servicevariation", "icon": ""}
              ]
            },
            {
              "prompt": "APP.HEADER.MENU.SETTINGS", "icon": "fa-bars", "dropdown": [
                {"prompt": "APP.HEADER.MENU.SETTINGS.CITY", "href": "/city", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.PROGNOSIS", "href": "/prognosis", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.SERVICE_CATEGORIES", "href": "/servicecategory", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.SERVICE_TYPES", "href": "/servicetype", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.STAFF_TYPES", "href": "/stafftype", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.STATUS", "href": "/status", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.TIMEFRAME", "href": "/timeframe", "icon": ""},
                {"prompt": "APP.HEADER.MENU.SETTINGS.WORK_STATUS", "href": "/workstatus", "icon": ""}
              ]
            },
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
          subview: {
            'study': ['name', 'study', 'collectioncentre', 'subject', 'user', 'form', 'survey'],
            'user': ['name', 'user'],
            'client': ['name', 'client', 'referral'],
            'referral': ['name', 'referraldetail', 'referral', 'altumprogramservices', 'service', 'invoice']
          }
        }
      },
      {
        name: 'altumadmin',
        roles: _.find(roles, {name: 'altumadmin'}).id,
        level: 2,
        menu: {
          tabview: [
            {"href": "/client", "icon": "fa-users", "prompt": "APP.HEADER.MENU.CLIENTS"},
            {"href": "/referral", "icon": "fa-ambulance", "prompt": "APP.HEADER.MENU.REFERRALS"},
            {"href": "/user", "icon": "fa-user", "prompt": "APP.HEADER.MENU.USER_MANAGER"},
            {
              "prompt": "APP.HEADER.MENU.ALTUM_TOOLS", "icon": "fa-wrench", "dropdown": [
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.ALTUM_SERVICES", "href": "/altumservice", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.APPROVERS", "href": "/approver", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.CLAIMS", "href": "/claim", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.COMPANIES", "href": "/company", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PAYORS", "href": "/payor", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PHYSICIANS", "href": "/physician", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PROGRAM_SERVICES", "href": "/programservice", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.SITES", "href": "/site", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.STAFF", "href": "/staff", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.PROGRAMS", "href": "/program", "icon": ""},
              {"prompt": "APP.HEADER.MENU.ALTUM_TOOLS.SERVICE_VARIATIONS", "href": "/servicevariation", "icon": ""}
            ]
            },
            {
              "prompt": "APP.HEADER.MENU.SETTINGS", "icon": "fa-bars", "dropdown": [
              {"prompt": "APP.HEADER.MENU.SETTINGS.CITY", "href": "/city", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.PROGNOSIS", "href": "/prognosis", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.SERVICE_CATEGORIES", "href": "/servicecategory", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.SERVICE_TYPES", "href": "/servicetype", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.STAFF_TYPES", "href": "/stafftype", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.STATUS", "href": "/status", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.TIMEFRAME", "href": "/timeframe", "icon": ""},
              {"prompt": "APP.HEADER.MENU.SETTINGS.WORK_STATUS", "href": "/workstatus", "icon": ""}
            ]
            }
          ],
          subview: {
            'study': ['name', 'study', 'collectioncentre', 'subject', 'user', 'form', 'survey'],
            'user': ['name', 'user'],
            'client': ['name', 'client', 'referral'],
            'referral': ['name', 'referraldetail', 'referral', 'altumprogramservices', 'service', 'invoice']
          }
        }
      },
      {
        name: 'coordinator',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains(['registered', 'coordinator'], role.name);
        }), 'id'),
        level: 2,
        menu: {
          tabview: [
            {prompt: 'APP.HEADER.MENU.STUDIES', href: '/study', icon: 'fa-group'},
            {prompt: 'APP.HEADER.MENU.USER_MANAGER', href: '/user', icon: 'fa-user'},
            {
              prompt: 'APP.HEADER.MENU.SUBJECT_PORTAL',
              sref: 'subjectportal.surveys',
              href: '/subjectportal/surveys',
              icon: 'fa-arrow-right'
            }
          ],
          subview: {
            'study': ['name', 'study', 'collectioncentre', 'subjectenrollment', 'userenrollment'],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'provider',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains(['registered', 'provider'], role.name);
        }), 'id'),
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
            'study': ['name', 'study', 'collectioncentre', 'subjectenrollment', 'userenrollment'],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'interviewer',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains(['registered', 'interviewer'], role.name);
        }), 'id'),
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
            'study': ['name', 'study', 'subject'],
            'user': ['name', 'user']
          }
        }
      },
      {
        name: 'subject',
        roles: _.pluck(_.filter(roles, function (role) {
          return _.contains(['registered', 'subject'], role.name);
        }), 'id'),
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
            'study': ['name', 'study'],
            'user': ['name', 'user']
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

})();
