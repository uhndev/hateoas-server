/**
* SubjectEnrollment
*
* @class SubjectEnrollment
* @description Model representation of a subject's enrollment in a collection centre
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {
  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  module.exports = {
    schema: true,
    attributes: {
      /**
       * subjectNumber
       * @description Equivalent of DADOS 2.0 subjectId that autoincrements with each
       *              instance of a subject's enrollment at a collection centre.
       * @type {Integer}
       */
      subjectNumber: {
        type: 'integer',
        required: true
      },

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
       * subject
       * @description The subject whose enrollment pertains to.
       * @type {Association} linked subject in enrollment
       */
      subject: {
        model: 'subject',
        required: true
      },

      /**
       * doe
       * @description Date of event in enrollment; is typically the date of surgery performed
       *              or other important events related to the timeline of a patient's care.
       * @type {Date}
       */
      doe: {
        type: 'date',
        required: true,
        date: true
      },

      /**
       * studyMapping
       * @description Depending on the associated study, study.attributes should define what
       *              attribute keys goes in this enrollment.studyMapping.
       *
       * @example
       * @type {Object}
       */
      studyMapping: {
        type: 'json',
        required: true,
        json: true
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
     * findByStudyName
     * @description End function for handling /api/study/:name/subject.  Should return a list
     *              of subjects in a given study and depending on the current users' group
     *              permissions, this list will be further filtered down based on whether
     *              or not those subjects and I share common collection centres.
     *
     * @param  {String}   studyName Name of study to search.  Passed in from SubjectEnrollmentController.
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
          var whereOp = { studyName: studyName };
          if (user.group.level > 1) {
            whereOp.collectionCentre = _.pluck(user.enrollments, 'collectionCentre');
          }
          return studysubject.find(query).where(whereOp);
        })
        .then(function (studySubjects) {
          cb(false, studySubjects)
        })
        .catch(cb);
    },

    beforeValidate: function(values, cb) {
      //Auto increment workaround
      SubjectEnrollment.findOne({
        where: { "collectionCentre": values.collectionCentre },
        sort:'subjectNumber DESC'
      }).exec(function (err, lastSubject) {
        if (err) cb(err);
        values.subjectNumber = (lastSubject && lastSubject.subjectNumber ?
          lastSubject.subjectNumber + 1 : 1);
        cb();
      });
    }

  };

})();


