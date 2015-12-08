/**
* UserEnrollment
*
* @class UserEnrollment
* @description Model representation of a user's enrollment/involvement in a collection centre
* @docs        http://sailsjs.org/#!documentation/models
*/


(function() {
  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var UserModel = require('./User.js');

  _.merge(exports, _super);
  _.merge(exports, {
    schema: true,
    attributes: {

      /**
       * collectionCentre
       * @description The collection centre for which this subject is enrolled in.
       * @type {Association} linked collection centre in enrollment
       */
      collectionCentre: {
        model: 'collectioncentre',
        required: true
      },

      /**
       * user
       * @description Many to one association between user enrollments and users.
       * @type {Association} linked coordinator in enrollment
       */
      user: {
        model: 'user',
        required: true
      },

      /**
       * centreAccess
       * @description For a particular user enrollment, a user can have multiple
       *              views of the data.  For example, a user can oversee a
       *              collection centre as a coordinator, and can oversee another
       *              collection centre as an interviewer.
       * @type {String} string value denoting type of view/access this user has.
       */
      centreAccess: {
        type: 'string',
        enum: ['coordinator', 'interviewer']
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

      toJSON: UserModel.attributes.toJSON
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
      return User.findOne(currUser.id)
        .populate('enrollments')
        .populate('group')
        .then(function (user) {
          this.user = user;
          return studyuser.find(query).where({ studyName: studyName });
        })
        .then(function (studyUsers) {
          if (this.user.group.level > 1) {
            return [false, _.filter(studyUsers, function (user) {
              // return users whose enrollments has at least one with proposed user
              return (_.some(_.pluck(this.user.enrollments, 'id'), function (currEnrollment) {
                return _.includes(user.userEnrollments, currEnrollment) || user.userEnrollments == currEnrollment;
              }));
            })];
          } else {
            return [false, studyUsers];
          }
        })
        .catch(function (err) {
          return [err, null];
        });
    }

  });

})();

