/**
* Survey
* @class Survey
* @description Model representation of a survey to be performed within a study
*              A survey has many sessions which dictate the points in time when
 *             data is to be collected from a subject.
* @docs        http://sailsjs.org/#!documentation/models
*/
(function() {

  var HateoasService = require('../services/HateoasService.js');
  module.exports = {
    schema: true,
    attributes: {

      /**
       * study
       * @description The study for which this survey captures data for.
       * @type {Association} linked study in survey
       */
      study: {
        model: 'study'
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
       * @type {String}
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
       * @type: {Association} 1-to-many relationship to the Session model
       */
      sessions: {
        collection: 'session',
        via: 'survey'
      },

      /**
       * versions
       * @description Collection of versions this particular survey has, in git terms, the instance
       *              of this Survey model is the HEAD revision, and the items in this collection
       *              represent the commit history.
       * @type {Association} 1-to-many relationship to the SurveyVersion model
       */
      versions: {
        collection: 'surveyversion',
        via: 'survey'
      },

      /**
       * lastPublished
       * @description Boolean flag of null || date defining whether or not subjects have already begun
       *              participating in this Survey.  If publishedOn has a date set, this survey can only
       *              be updated by creating a new SurveyVersion and bumping up the latest version reference to match.
       *              This date should always reflect the latest SurveyVersion's activeOn date attribute.
       * @type {Date} Date denoting the day when subjects began participating in a survey
       */
      lastPublished: {
        type: 'date',
        defaultsTo: null
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

    findByStudyName: function(studyName, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.name;

      // get study surveys
      return Study.findOneByName(studyName).populate('surveys')
        .then(function (study) {
          var studySurveyIds = _.pluck(study.surveys, 'id');
          return Survey.find(query).then(function (surveys) {
            return _.filter(surveys, function (survey) {
              return _.includes(studySurveyIds, survey.id);
            });
          });
        })
        .then(function (filteredSurveys) {
          return [false, filteredSurveys];
        })
        .catch(function (err) {
          return [err, null];
        });
    }

  };

})();

