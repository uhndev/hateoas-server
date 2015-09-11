/**
* SubjectEnrollment
*
* @class SubjectEnrollment
* @description Model representation of a subject's enrollment in a collection centre
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {
  var moment = require('moment');
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
        type: 'integer'
      },

      /**
       * study
       * @description The study for which this subject is enrolled in.
       * @type {Association} linked study in enrollment
       */
      study: {
        model: 'study'
      },

      /**
       * collectionCentre
       * @description The collection centre for which this subject is enrolled in.
       * @type {Association} linked collection centre in enrollment
       */
      collectionCentre: {
        model: 'collectioncentre'
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
        date: true
      },

      /**
       * studyMapping
       * @description Depending on the associated study, study.attributes should define what
       *              attribute keys goes in this enrollment.studyMapping.
       * @type {Object}
       */
      studyMapping: {
        type: 'json',
        json: true,
        defaultsTo: {}
      },

      /**
       * status
       * @description Represents the subject's current status in this enrollment.  Subjects
       *              can be enrolled as REGISTERED which signifies that they haven't been
       *              enrolled in any particular collection centre yet.  After selecting a
       *              collection centre, status should be set to ONGOING.
       * @type {String}
       */
      status: {
        type: 'string',
        enum: [
          'REGISTERED',
          'ONGOING',
          'LOST TO FOLLOWUP',
          'WITHDRAWN',
          'INELIGIBLE',
          'DECEASED',
          'TERMINATED',
          'COMPLETED'
        ]
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
      return User.findOne(currUser.id)
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
          return [false, studySubjects];
        })
        .catch(function (err) {
          return [err, null];
        });
    },

    /**
     * beforeCreate
     * @description Before validation/creation, auto-increments the subjectNumber by latest study
     *              and also inserts the collection centre study as a parameter
     * @param  {Object}   values  given subject enrollment object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeCreate: function(values, cb) {
      SubjectEnrollment.findOne({
        where: { "study": values.study },
        sort:'subjectNumber DESC'
      }).exec(function (err, lastSubject) {
        if (err) cb(err);
        values.subjectNumber = (lastSubject && lastSubject.subjectNumber ?
        lastSubject.subjectNumber + 1 : 1);
        // make sure if we're creating an enrollment with no studyMapping set yet, the status should be set to REGISTERED
        if (_.isEmpty(values.studyMapping)) {
          values.status = 'REGISTERED';
        } else {
          values.status = 'ONGOING';
        }
        cb();
      });

    },

    /**
     * afterCreate
     * @description After enrolling a subject in a study, create their associated SubjectSchedules
     *              for each Session and for each Survey in enrolled Study.  To achieve this, we
     *              find a list of study surveys, flatten out all the Sessions for each study in survey
     *              and create SubjectSchedules based on the Sessions.
     */
    afterCreate: function (values, cb) {
      Study.findOne(values.study).populate('surveys')
        .then(function (study) {
          return Survey.find(_.pluck(study.surveys, 'id')).populate('sessions');
        })
        .then(function (surveys) {
          return _.reduce(surveys, function (result, survey) {
            return result.concat(survey.sessions);
          }, []);
        })
        .then(function (sessions) {
          return Promise.all(
            _.map(sessions, function (session) {
              var availableFrom = moment(values.doe).add(session.timepoint, 'days').subtract(session.availableFrom, 'days');
              var availableTo = moment(values.doe).add(session.timepoint, 'days').add(session.availableTo, 'days');
              return SubjectSchedule.create({
                availableFrom: availableFrom.toDate(),
                availableTo: availableTo.toDate(),
                status: 'IN PROGRESS',
                session: session.id,
                subjectEnrollment: values.id
              });
            })
          );
        })
        .then(function (createdSchedules) {
          cb();
        })
        .catch(cb);
    },

    /**
     * beforeUpdate
     * @description We need to perform some validation on the state of a subject's statuses as
     *              enrollments are created.
     * @param  {Object}   values  given subject enrollment object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeUpdate: function(values, cb) {
      // when updating, if studyMapping is set, status cannot be set back to REGISTERED
      if (!_.isEmpty(values.studyMapping)) {
        values.status = (values.status === 'REGISTERED') ? 'ONGOING' : values.status;
      }
      // otherwise if studyMapping still not set, make sure user isn't trying to set status to
      // something other than REGISTERED if they haven't set a mapping yet.
      else {
        values.status = 'REGISTERED';
      }
      cb();
    }

  };

})();


