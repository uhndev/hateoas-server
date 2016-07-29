/**
 * A virtual model representing a database view.
 * See config/db/studyuser.sql for view definition.
 */
(function () {
  var UserModel = require('./../../User.js');
  var _super = require('./altumBaseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      displayName: {
        type: 'string'
      },
      username: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      group: {
        model: 'group'
      },
      userType: {
        type: 'string'
      },
      person: {
        model: 'person'
      },
      prefix: {
        type: 'string'
      },
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      dateOfBirth: {
        type: 'date'
      },

      /**
       * getResponseLinks
       * @description Provides the response links array in our HATEOAS response; these links
       *              should denote transitionable states that are accessible from state /api/user.
       *
       * @param  {ID} id Study ID
       * @return {Array} Array of response links
       */
      getResponseLinks: function(id) {
        return [
          {
            'rel': 'name',
            'prompt': this.displayName,
            'name': 'name',
            'href': [
              sails.config.appUrl + sails.config.blueprints.prefix, 'user', this.id
            ].join('/')
          },
          {
            'rel': sails.models.user.identity,
            'prompt': 'APP.HEADER.SUBMENU.OVERVIEW',
            'name': 'name',
            'href': [
              sails.config.appUrl + sails.config.blueprints.prefix, 'user', this.id
            ].join('/')
          }
        ]
      },

      toJSON: UserModel.attributes.toJSON
    }

  });
})();
