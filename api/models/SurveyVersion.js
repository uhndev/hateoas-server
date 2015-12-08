/**
* SurveyVersion
*
* @class SurveyVersion
* @description Model that captures and tracks the different versions of surveys that have been created
* @docs        http://sailsjs.org/#!documentation/models
*/


(function () {
  var _super = require('./BaseModel.js');
  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {
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
       *              SubjectEnrollment.  We do a data dump because if it were a two way association
       *              to the Session model, we would lose the version tracking capabilities in Session
       *              whenever Session is edited.  Hence, why Session.surveyVersion needs to be
       *              a one way association.
       * @type: {Array} Data dump of session ids in survey at time of version creation.
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
    },

    /**
     * getLatestSurveyVersion
     * @description Convenience method to return latest survey version given an options object
     * @param survey object with id, or surveyID
     */
    getLatestSurveyVersion: function(survey) {
      return SurveyVersion.find({ survey: (survey.id || survey)})
        .sort('revision DESC')
        .then(function (latestSurveyVersions) {
          return _.first(latestSurveyVersions);
        });
    }
  });
})();


