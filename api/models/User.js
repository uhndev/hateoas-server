/**
 * User
 *
 * @class User
 * @description Model representation of a user
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/User.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/User.js
 */

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/api/models/User');
  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    schema: true,
    attributes: {
      /**
       * firstname
       * @description A user's first name.
       * @type {String}
       */
      firstname: {
        type: 'string'
      },

      /**
       * lastname
       * @description A user's last name.
       * @type {String}
       */
      lastname: {
        type: 'string'
      },

      /**
       * prefix
       * @description Enumeration of allowable prefixes for a user.
       * @type {Enum}
       */
      prefix: {
        type: 'string',
        enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.']
      },

      /**
       * gender
       * @description Enumeration of allowable genders of a user.
       * @type {Enum}
       */
      gender: {
        type: 'string',
        enum: ['Male', 'Female']
      },

      /**
       * dob
       * @description A user's date of birth.
       * @type {Date}
       */
      dob: {
        type: 'date'
      },

      /**
       * group
       * @description A user's registered group which in turn dictates what actions
       *              this user is permitted to perform.
       * @type {Association}
       */
      group: {
        model: 'group'
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
      function setOwner (user, cb) {
        sails.log('User.afterCreate.setOwner', user);
        User
          .update({ id: user.id }, { owner: user.id })
          .then(function (user) {
            cb();
          })
          .catch(cb);
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
      } else {
        cb();
      }
    },

    /**
     * findByStudyName
     * @description End function for handling /api/study/:name/user.  Should return a list
     *              of users in a given study and depending on the current users' group
     *              permissions, this list will be further filtered down based on whether
     *              or not those users and I share common collection centres.
     *
     * @param  {String}   studyName Name of study to search.  Passed in from UserController.
     * @param  {Object}   currUser  Current user used in determining filtering options based on access
     * @param  {Object}   options   Query options potentially passed from queryBuilder in frontend
     * @param  {Function} cb        Callback function upon completion
     */
    findByStudyName: function(studyName, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.name;
      User.findOne(currUser.id)
        .populate('enrollments')
        .populate('group')
        .then(function (user) {
          this.user = user;
          return studyuser.find({ studyName: studyName }).where(query);
        })
        .then(function (studyUsers) {
          if (this.user.group.level > 1) {
            cb(false, _.filter(studyUsers, function (user) {
              return !_.isEmpty(_.xor(user.userEnrollments, _.pluck(this.user.enrollments, 'id')));
            }));
          } else {
            cb(false, studyUsers);
          }
        })
        .catch(cb);
    }

  });
})();

