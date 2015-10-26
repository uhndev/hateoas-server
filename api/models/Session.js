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
       *              1) recurring with timepoint X       : repeat session every X days
       *              2) scheduled with timepoint X       : enable session after X days
       *              3) non-scheduled with timepoint null: session available always
       * @type {Integer}
       */
      timepoint: {
        type: 'integer',
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
        integer: true
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
        integer: true
      },

      /**
       * type
       * @description Type of session where scheduled means an event that should be repeated at regular
       *              intervals, or non-scheduled which means a session that is available whenever.
       * @type {String}
       */
      type: {
        type: 'string',
        enum: [
          'scheduled',
          'recurring',
          'non-scheduled'
        ]
      },

      /**
       * formOrder
       * @description Array denoting the order in which forms in this session should appear.
       * @type {Array}
       */
      formOrder: {
        type: 'array',
        defaultsTo: [],
        array: true
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
     * createLifecycle
     * @description Wraps the default Session.create model method, but allows us manual control of
     *              when we want to execute Session lifecycle logic.
     * @param createValues session to create
     * @returns {Object | Promise}
     */
    createLifecycle: function(createValues) {
      return Session.create(createValues)
        .then(function (session) {
          this.session = session;
          return SurveyService.afterCreateSession(session);
        })
        .then(function () {
          return this.session;
        });
    },

    /**
     * updateLifecycle
     * @description Wraps the default Session.update model method, but allows us manual control of
     *              when we want to execute Session lifecycle logic.
     * @param findBy find criteria to find Session to update
     * @param updateValues proposed changes to Session object
     * @returns {Object | Promise}
     */
    updateLifecycle: function(findBy, updateValues) {
      return Session.update(findBy, updateValues)
        .then(function (session) {
          this.session = session;
          return Session.findOne(_.first(session).id).populate('subjectSchedules');
        })
        .then(function (updatedSession) {
          return SurveyService.afterUpdateSession(updatedSession);
        })
        .then(function (schedules) {
          return this.session;
        });
    },

    /**
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this session's expiredAt attribute, this function
     *              will check and invalidate any subject schedules and by extension,
     *              any answersets pertaining to those schedules.
     *
     * @param  {Object}   values  updated session object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function(values, cb) {
      // if expiring a Session, expire all associated SubjectSchedules
      if (!_.isNull(values.expiredAt)) {
        Session.findOne(values.id).populate('subjectSchedules').then(function (session) {
          return SubjectSchedule.update({ id: _.pluck(session.subjectSchedules, 'id') }, {
           expiredAt: new Date
          });
        })
        .then(function (schedules) {
          cb();
        })
        .catch(cb);
      } else {
        cb();
      }
    }

  };
})();
