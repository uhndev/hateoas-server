/**
* Session
*
* @description Model representation of a session of a Survey.  A session denotes the abstract points in time for which
*              data is to be collected for a subject.  A session stores this information by defining an integer
*              timeline for which SubjectSchedules can be stamped out based on this number, namely the availableFrom
*              and availableTo dates are determined based on the settings in this model.
* @docs        http://sailsjs.org/#!documentation/models
*/

(function () {
  var moment = require('moment');
  var Promise = require('q');
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,
    attributes: {

      /**
       * survey
       * @description Reference to the head revision of the current survey
       * @type {Association}
       */
      survey: {
        model: 'survey'
      },

      /**
       * surveyVersion
       * @description Reference to the version of the survey we are using for this session
       * @type {Association}
       */
      surveyVersion: {
        model: 'surveyversion'
      },

      /**
       * name
       * @description Name of the session, i.e. Baseline, 1 Month, 2 Month, etc.
       * @type: {String}
       */
      name: {
        type: 'string'
      },

      /**
       * timepoint
       * @description Integer denoting the days from the subject enrolment DOE this session
       *              should occur.  The availableFrom and availableTo fields in SubjectSchedule are
       *              determined based on this number.  There are several configurations between
       *              this and the type attribute that are possible:
       *              1) scheduled with timepoint X      : repeat session every X days
       *              2) non-scheduled with timepoint X  : enable session after X days
       * @type {Integer}
       */
      timepoint: {
        type: 'integer',
        required: true,
        integer: true
      },

      /**
       * availableFrom
       * @description Days before the timepoint event for which data capture should be allowed.
       *              i.e. with a timepoint of 90 days, availableFrom = 5, and availableTo = 2,
       *              SubjectSchedule will become available 5 days before and 2 days after every 90 day session.
       * @type {Integer}
       */
      availableFrom: {
        type: 'integer',
        integer: true,
        defaultsTo: 1
      },

      /**
       * availableFrom
       * @description Days after the timepoint event for which data capture should be allowed.
       *              i.e. with a timepoint of 90 days, availableFrom = 5, and availableTo = 2,
       *              SubjectSchedule will become available 5 days before and 2 days after every 90 day session.
       * @type {Integer}
       */
      availableTo: {
        type: 'integer',
        integer: true,
        defaultsTo: 1
      },

      /**
       * type
       * @description Type of session where scheduled means an event that should be repeated at regular
       *              intervals, or non-scheduled which means a one time data capture event.
       * @type {String}
       */
      type: {
        type: 'string',
        enum: [
          'scheduled',
          'non-scheduled'
        ]
      },

      /**
       * formVersions
       * @description Collection of forms for subject to fill out at the given session/timepoint.
       * @type {Association} many-to-many relationship to the FormVersion model
       */
      formVersions: {
        collection: 'formversion',
        via: 'sessions'
      },

      /**
       * subjectSchedules
       * @description Collection of instantiated SubjectSchedules for each subject in respective
       *              SubjectEnrollment.  The availableFrom and availableTo attributes are calculated based on
       *              the timepoint attribute in this model.
       * @type {Association} 1-to-many relationship to the SubjectSchedule model
       */
      subjectSchedules: {
        collection: 'subjectschedule',
        via: 'session'
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
     * @description After updating the head revision, depending on whether or not users have
     *              filled out any AnswerSets, we create new SurveyVersions as needed.
     */
    afterUpdate: function(values, cb) {
      // begin promise chain with populated Session
      var promise = Session.findOne(values.id).populate('subjectSchedules')
        .then(function (session) {
          this.session = session;
          return session;
        });

      // if expiring a Session, expire all associated SubjectSchedules
      if (!_.isNull(values.expiredAt)) {
        promise.then(function (session) {
          return SubjectSchedule.update({ id: _.pluck(session.subjectSchedules, 'id') }, {
           expiredAt: new Date
          });
        })
        .then(function (schedules) {
          cb();
        })
        .catch(cb);
      } else {
        Survey.findOne(values.survey).populate('sessions').exec(function (err, survey) {
          // if lastPublished set on Survey, then there are AnswerSets referring to this version
          if (survey.lastPublished !== null && _.isNull(survey.expiredAt)) {
            // in that case, stamp out next survey version
            promise
              .then(function (session) {
                return SurveyVersion.findOne({
                  where: { survey: values.survey },
                  sort: 'revision DESC'
                });
              })
              .then(function (latestSurveyVersion) {
                // create new survey version with updated revision number
                return SurveyVersion.findOne({ survey: values.survey })
                  .sort('revision DESC')
                  .populate('sessions')
                  .then(function (latestSurveyVersion) {
                    var newSurveyVersion = {
                      revision: latestSurveyVersion.revision + 1,
                      survey: values.survey
                    };
                    _.merge(newSurveyVersion, _.pick(survey, 'name', 'completedBy', _.pluck(survey.sessions, 'id')));
                    return SurveyVersion.create(newSurveyVersion);
                  });
              });
          }
          /**
           * otherwise updates are done in place for the current head
           * since its not published yet, we have two more scenarios:
           * 1) no subjects enrolled yet = do nothing
           * 2) subject already enrolled = create if not exist, update if exist
           */
          promise
            .then(function () {
              return Survey.findOne(values.survey);
            })
            .then(function (survey) {
              return studysubject.find({ studyId: survey.study });
            })
            .then(function (subjectEnrollments) {
              // scenario 1; no subjects enrolled yet so do nothing
              if (!subjectEnrollments) {
                cb();
              }
              // scenario 2; subjects enrolled, create or update SubjectSchedules
              else {
                return Promise.all(
                  _.map(subjectEnrollments, function (enrollment) {
                    var availableFrom = moment(enrollment.doe).add(values.timepoint, 'days')
                      .subtract(values.availableFrom, 'days');
                    var availableTo = moment(enrollment.doe).add(values.timepoint, 'days')
                      .add(values.availableTo, 'days');

                    // create subjectSchedules if not exist
                    if (!this.session.subjectSchedules) {
                      return SubjectSchedule.create({
                        availableFrom: availableFrom.toDate(),
                        availableTo: availableTo.toDate(),
                        status: 'IN PROGRESS',
                        session: values.id,
                        subjectEnrollment: enrollment.id
                      });
                    }
                    // update existing subjectSchedules
                    else {
                      return SubjectSchedule.update({session: values.id, subjectEnrollment: enrollment.id}, {
                        availableFrom: availableFrom.toDate(),
                        availableTo: availableTo.toDate()
                      });
                    }
                  })
                );
              }
            })
            .then(function (schedules) {
              cb();
            })
            .catch(cb);
        });
      }
    },

    /**
     * afterCreate
     * @description After creating a session, create SubjectSchedules iff there are subjects
     *              enrolled in the study at the time of creation.
     */
    afterCreate: function (values, cb) {
      Survey.findOne(values.survey)
        .then(function (survey) {
          return studysubject.find({ studyId: survey.study });
        })
        .then(function (subjectEnrollments) {
          if (subjectEnrollments) {
            return Promise.all(
              _.map(subjectEnrollments, function (enrollment) {
                var availableFrom = moment(enrollment.doe).add(values.timepoint, 'days')
                  .subtract(values.availableFrom, 'days');
                var availableTo = moment(enrollment.doe).add(values.timepoint, 'days')
                  .add(values.availableTo, 'days');
                return SubjectSchedule.findOrCreate({
                  availableFrom: availableFrom.toDate(),
                  availableTo: availableTo.toDate(),
                  status: 'IN PROGRESS',
                  session: values.id,
                  subjectEnrollment: enrollment.id
                });
              })
            )
          } else {
           return null;
          }
        })
        .then(function (createdSchedules) {
          cb();
        })
        .catch(cb);
    }
  };
})();
