/**
* SubjectSchedule
*
* @description Model representation of an scheduled data capture event for a subject in an study's survey.
*              SubjectSchedules are instantiated based on Sessions in a Survey and are done so based on
 *             individual SubjectEnrollments.  i.e. Every subject will end up having their own unique SubjectSchedules.
* @docs        http://sailsjs.org/#!documentation/models
*/


(function () {
  var _super = require('./DadosBaseModel.js');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * availableFrom
       * @description Date denoting when this data capture event should begin to be available to the subject
       * @type {Datetime}
       */
      availableFrom: {
        type: 'datetime'
      },

      /**
       * availableTo
       * @description Date denoting when this data capture event should no longer be available to the subject
       * @type {Datetime}
       */
      availableTo: {
        type: 'datetime'
      },

      /**
       * subjectEnrollment
       * @description Reference to the subject enrollment data and in effect, the subject for their schedule
       * @type {Association}
       */
      subjectEnrollment: {
        model: 'subjectenrollment'
      },

      /**
       * answerSets
       * @description Collection of collected answersets during this SubjectSchedule
       * @type {Association}
       */
      answerSets: {
        collection: 'answerset',
        via: 'subjectSchedule'
      },

      /**
       * status
       * @description Status flag denoting whether or not all data required has been captured for this SubjectSchedule
       * @type {String}
       */
      status: {
        type: 'string',
        enum: [
          'IN PROGRESS',
          'COMPLETE'
        ]
      },

      /**
       * session
       * @description Reference to session template that instantiated this SubjectSchedule
       * @type {Association}
       */
      session: {
        model: 'session'
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
  });

})();
