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
    }
  };
})();
