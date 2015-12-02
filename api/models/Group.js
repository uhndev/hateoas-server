/**
* Group
*
* @class Group
* @description Model representation of a group.
* @docs        http://sailsjs.org/#!documentation/models
*/



(function() {
  var _super = require('./BaseModel.js');

  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {
    schema: true,

    attributes: {
      /**
       * name
       * @description Unique name of our group of roles.
       * @type {String}
       */
      name: {
        type: 'string',
        required: true,
        unique: true
      },

      /**
       * level
       * @description Integer denoting the level of access this group permits.
       *              Lower has more authority, with level 1 representing admins,
       *              level 2 representing coordinators/interviewers, and level
       *              3 representing subject level access.
       *
       * @type {Integer}
       */
      level: {
        type: 'integer',
        enum: [1, 2, 3]
      },

      /**
       * users
       * @description Associated list of users that belong in this group.  Allows
       *              us to very quickly retrieve users by group and apply roles
       *              to them when editing permissions
       *
       * @type {Association} linked users to an instance of this group
       */
      users: {
        collection: 'user',
        via: 'group'
      },

      /**
       * roles
       * @description Associated list of atomic roles (i.e. readStudy, createSubject)
       *              that members of this group can perform. Changing this collection
       *              at runtime in the access management page will propagate these
       *              roles to be applied to every associated group.users.  Proceed
       *              with caution if you want to modify group permissions.
       *
       * @type {Association} linked roles to an instance of this group
       */
      roles: {
        collection: 'role',
        via: 'groups'
      },

      /**
       * menu
       * @description JSON object describing the frontend main and submenu tabs.
       *              Object MUST contain a 'tabview' and 'subview' attribute, each
       *              containing a list of options for each.  tabview stores the
       *              displayed text on the main menu buttons and subview should
       *              store the response links that are accessible for the current
       *              user given their group.
       * @example
       *  menu: {
            tabview: [
              { prompt: 'Studies', href: '/study', icon: 'fa-group' },
              { prompt: 'User Manager', href: '/user', icon: 'fa-user' }
            ],
            subview: [ 'overview', 'subject', 'user' ]
          }
       * @type {Object}
       */
      menu: {
        type: 'json'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();
