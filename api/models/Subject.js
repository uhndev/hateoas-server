/**
* Subject
*
* @class Subject
* @description Model representation of a subject
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {

  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  module.exports = {
    schema: true,

    attributes: {
      /**
       * user
       * @description Associated user that this subject belongs to.  The User
       *              model holds the personal data as well as the access
       *              attributes for logging in and permissions.
       *
       * @type {Association}
       */
      user: {
        model: 'user',
        required: true
      },

      /**
       * enrollments
       * @description List of subject enrollments storing which collection centres
       *              and studies I, as a subject am enrolled in.
       *
       * @type {Association}
       */
      enrollments: {
        collection: 'subjectenrollment',
        via: 'subject'
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
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this subject's expiredAt attribute, this function
     *              will check and invalidate any active user/subject enrollments.
     *
     * @param  {Object}   updated updated subject object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function(updated, cb) {
      if (!_.isNull(updated.expiredAt)) {
        UserEnrollment.update({ user: updated.user }, { expiredAt: new Date() })
        .then(function (userEnrollments) {
          return SubjectEnrollment.update({ subject: updated.id }, { expiredAt: new Date() });
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
     * @description End function for handling /api/study/:name/subject.  Should return a list
     *              of subjects in a given study and depending on the current users' group
     *              permissions, this list will be further filtered down based on whether
     *              or not those subjects and I share common collection centres.
     *
     * @param  {String}   studyName Name of study to search.  Passed in from SubjectController.
     * @param  {Object}   currUser  Current user used in determining filtering options based on access
     * @param  {Object}   options   Query options potentially passed from queryBuilder in frontend
     * @param  {Function} cb        Callback function upon completion
     */
    findByStudyName: function(studyName, currUser, options, cb) {
      Subject.find().exec(function (err, subjects) {
        cb(false, subjects);
      });
      // TODO
      // EnrollmentService
      //   .findStudySubjects(studyName, currUser)
      //   .then(function (users) { // send data through to callback function
      //     return cb(false, users);
      //   })
      //   .catch(cb);
    }

  };

}());
