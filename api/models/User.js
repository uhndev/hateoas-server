/**
 * User
 *
 * @class User
 * @description Model representation of a user
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/User.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/User.js
 */


(function() {
  var _super = require('./BaseModel.js');
  var faker = require('faker');

  var _ = require('lodash');
  var _user = require('sails-permissions/api/models/User');
  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, _user);
  _.merge(exports, {

    defaultSortBy: 'displayName ASC',

    displayFields: [ 'prefix', 'firstname', 'lastname'],

    attributes: {
      /**
       * firstname
       * @description A user's first name.
       * @type {String}
       */
      firstname: {
        type: 'string',
        generator: faker.name.firstName
      },

      /**
       * lastname
       * @description A user's last name.
       * @type {String}
       */
      lastname: {
        type: 'string',
        generator: faker.name.lastName
      },


      /**
       * prefix
       * @description Enumeration of allowable prefixes for a user.
       * @type {Enum}
       */

      prefix: {
        type: 'string',
        enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
        generator: function () {
          return _.sample(User.attributes.prefix.enum);
        }
      },


      /**
       * gender
       * @description Enumeration of allowable genders of a user.
       * @type {Enum}
       */
      gender: {
        type: 'string',
        enum: ['Male', 'Female'],
        generator: function() {
          return _.sample(User.attributes.gender.enum);
        }
      },


      /**
       * dob
       * @description A user's date of birth.
       * @type {Date}
       */
      dob: {
        type: 'date',
        generator: function(state) {
          return faker.date.past();
        }
      },


      /**
       * group
       * @description A user's registered group which in turn dictates what actions
       *              this user is permitted to perform.
       * @type {Association}
       */
      group: {
        model: 'group',
        generator: function(state) {
          return (state && _.has(state, 'group')) ? state.group: 'coordinator';
        }
      },


      /**
       * owner
       * @description Reference to who the 'owner' of this is - is used in the owner
       *              relation in roles like readUserOwner/updateUserOwner which are
       *              roles specifically for handling read/updates of themselves.
       * @type {Association}
       */
      owner: {
        model: 'user'
      },

      /**
       * owner
       * @description Reference to who the 'person' of this is -
       *
       * @type {Association}
       */

      person: {
        model:'person'
      },

      /**
       * enrollments
       * @description Linked associations of UserEnrollments denoting which collection
       *              centres/studies this user is overseeing as a coordinator/interviewer.
       * @type {Association}
       */
      enrollments: {
        collection: 'userenrollment',
        via: 'user'
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
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
            'prompt': Utils.User.getFullName(this),
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

      /**
       * expiredPassword
       * @description flag put in place to see if the user has an expired password
       * @type {Boolean} flag
       */
       expiredPassword: {
         type:'boolean',
         defaultsTo: true
       },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * afterCreate
     * @description Lifecycle function that fires after a User is created.  We
     *              do two things whenever we create a user:  set the owner attribute
     *              to themselves so that we can allow users to read/update themselves
     *              only.  Afterwards, we grant them roles based on the group we
     *              assigned them during their creation.
     *
     * @type {Array} Functions that are called in sequence following user creation
     */
    afterCreate: [
      function setOwner(user, cb) {
        User.update({id: user.id}, {owner: user.id})
          .then(function (user) {
            cb();
          })
          .catch(cb);
      },
      function setProvider(user, cb) {
        if (user.group == 'provider') { // if desired group is provider, create associated provider
          Provider.create({ user: user.id })
            .then(function (user) {
              cb();
            })
            .catch(cb);
        } else {
          cb();
        }
      }
    ],

    /**
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this user's expiredAt attribute, this function
     *              will check and invalidate any active user/subject enrollments.
     *
     * @param  {Object}   updated updated user object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function(updated, cb) {
      if (!_.isNull(updated.expiredAt)) {
        UserEnrollment.update({ user: updated.id }, { expiredAt: new Date() })
        .then(function (userEnrollments) {
          // find if deleted user was a subject
          return Subject.find({ user: updated.id });
        })
        .then(function (subjects) {
          // update any possible subject enrollments
          return SubjectEnrollment.update({ subject: _.pluck(subjects, 'id') }, { expiredAt: new Date() });
        })
        .then(function (subjectEnrollments) {
          cb();
        })
        .catch(cb);
      } else if (updated.group == 'provider') {
        Provider.findOne({ user: updated.id }).exec(function (err, provider) {
          if (err) {
            cb(err);
          } else {
            var promise = (!provider) ? Provider.create({ user: updated.id }) : Provider.update({ id: provider.id }, { user: updated.id });
            promise.then(function (updatedProvider) {
              cb();
            }).catch(cb);
          }
        });
      } else {
        cb();
      }
    },

    /**
     * generate
     * @description Convenience method for returning a Model object to be created.  The function
     *              loops through Model attributes that have a generator function defined.  For the
     *              User model however, we add additional auth attributes that were inherited from
     *              sails-auth and sails-permissions.
     * @param state {Object}
     * @returns {Object}
     */
    generate: function (state) {
      var userInfo = {
        owner: 1,
        createdBy: 1
      };
      _.each(User._attributes, function (value, key) {
        if (_.isFunction(value.generator)) {
          userInfo[key] = value.generator(state);
        }
      });

      return _.merge({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        passports: [
          {
            protocol: 'local',
            password: 'Password123'
          }
        ]
      }, userInfo);
    }
  });
})();
