/**
 * A virtual model representing a database view.
 * See config/db/studysurvey.sql for view definition.
 */
(function() {
  var SessionModel = require('./../Session.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes: {
      type: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      timepoint: {
        type: 'integer'
      },
      availableFrom: {
        type: 'integer'
      },
      availableTo: {
        type: 'integer'
      },
      formVersions: {
        type: 'array'
      },
      survey: {
        model: 'survey'
      },
      surveyVersion: {
        model: 'surveyversion'
      },
      surveyName: {
        type: 'string'
      },
      completedBy: {
        type: 'string'
      },
      study: {
        model: 'study'
      },
      studyName: {
        type: 'string'
      },
      toJSON: SessionModel.attributes.toJSON
    }

  });

})();

