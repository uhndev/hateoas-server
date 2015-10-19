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
            tabview: [{"prompt": "Studies", "href": "/study", "icon": "fa-group"}, {
              "href": "/assessment",
              "icon": "fa-stethoscope",
              "prompt": "Assessments"
            }, {"prompt": "User Manager", "href": "/user", "icon": "fa-user"}, {
              "prompt": "Tools",
              "icon": "fa-cog",
              "dropdown": [{
                "prompt": "Form Builder",
                "href": "/formbuilder",
                "icon": "fa-wrench"
              }, {"prompt": "Workflow Editor", "href": "/workflow", "icon": "fa-code"}, {
                "prompt": "Groups",
                "href": "/group",
                "icon": "fa-users"
              }, {"prompt": "Access Management", "href": "/access", "icon": "fa-lock"}]
            }, {
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
              }, {"prompt": "Physician", "href": "/physician", "icon": "fa-stethoscope"}, {
                "prompt": "Program",
                "href": "/program",
                "icon": "fa-medkit"
              }, {"prompt": "Status", "href": "/status", "icon": "fa-calandar-check-o"}]
            }],
            subview: ["name", "overview", "collectioncentre", "subject", "user", "form", "survey"]
          }
        },
        {
          name: 'coordinator',
          roles: coordinatorRoles,
          level: 2,
          menu: {
            tabview: [
              {prompt: 'Studies', href: '/study', icon: 'fa-group'},
              {prompt: 'User Manager', href: '/user', icon: 'fa-user'}
            ],
            subview: ['name', 'overview', 'subject', 'user']
          }
        },
        {
          name: 'interviewer',
          roles: interviewerRoles,
          level: 2,
          menu: {
            tabview: [
              {prompt: 'Studies', href: '/study', icon: 'fa-group'},
              {prompt: 'My Profile', href: '/user', icon: 'fa-user'}
            ],
            subview: ['name', 'overview', 'subject']
          }
        },
        {
          name: 'subject',
          roles: subjectRoles,
          level: 3,
          menu: {
            tabview: [
              {prompt: 'My Studies', href: '/study', icon: 'fa-group'},
              {prompt: 'My Profile', href: '/user', icon: 'fa-user'}
            ],
            subview: ['name', 'overview']
          }
        }
      ]
      ;

    return Promise.all(
      _.map(groups, function (group) {
        return Group.findOrCreate({name: group.name}, group);
      })
    );
  };

})
();
