/**
* SurveyVersion
*
* @class SurveyVersion
* @description Model that captures and tracks the different versions of surveys that have been created
* @docs        http://sailsjs.org/#!documentation/models
*/

(function () {
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,
    attributes: {

      /**
       * revision
       * @description The version number which dictates what the version is for the associated Survey
       * @type {Integer}
       */
      revision: {
        type: 'integer',
        defaultsTo: 1
      },

      /**
       * survey
       * @description Reference to the survey for which this SurveyVersion tracks changes for
       * @type {Assiciation}
       */
      survey: {
        model: 'survey'
      },

      /**
       * name
       * @description The name of the survey, i.e. LEAP SURVEY
       * @type {String}
       */
      name: {
        type: 'string',
        required: true
      },

      /**
       * completedBy
       * @description Reference for who should be filling out this survey;
       *              the subject or a coordinator on their behalf.
       * @type: {String}
       */
      completedBy: {
        type: 'string',
        enum: ['subject', 'coordinator']
      },

      /**
       * sessions
       * @description Collection of set time intervals that define when data should be collected
       *              for each subject based on their date of event.  Each session created acts as
       *              a template for SubjectSchedules to be stamped out for each subject in
       *              SubjectEnrollment
       * @type: {Array} Data dump of sessions in survey at time of version creation.
       */
      sessions: {
        type: 'array'
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


