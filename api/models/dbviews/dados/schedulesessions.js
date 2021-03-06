/**
 * A virtual model representing a database view.
 * See config/db/schedulesessions.sql for view definition.
 */
(function() {
  var SubjectScheduleModel = require('./../../dados/SubjectSchedule.js');
  var _super = require('./dadosBaseView.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes: {
      availableFrom: {
        type: 'date'
      },
      availableTo: {
        type: 'date'
      },
      subjectEnrollment: {
        model: 'subjectenrollment'
      },
      subjectid: {
        model: 'subject'
      },
      status: {
        type: 'string'
      },
      session: {
        model: 'session'
      },
      name: {
        type: 'string'
      },
      timepoint: {
        type: 'integer'
      },
      type: {
        type: 'string'
      },
      survey: {
        model: 'survey'
      },
      surveyName: {
        type: 'string'
      },
      surveyVersion: {
        type: 'surveyversion'
      },
      formOrder: {
        type: 'array'
      },
      formVersions: {
        type: 'array'
      },
      toJSON: SubjectScheduleModel.attributes.toJSON
    }

  });

})();

