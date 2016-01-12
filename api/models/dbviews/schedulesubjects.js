/**
 * A virtual model representing a database view.
 * See config/db/schedulesubjects.sql for view definition.
 */
(function() {
  var SubjectScheduleModel = require('./../SubjectSchedule.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes: {
      subject: {
        model: 'subject'
      },
      user: {
        model: 'user'
      },
      collectionCentre: {
        model: 'collectioncentre'
      },
      subjectNumber: {
        type: 'integer'
      },
      study: {
        model: 'study'
      },
      studyName: {
        type: 'string'
      },
      collectionCentreName: {
        type: 'string'
      },
      studyMapping: {
        type: 'json'
      },
      enrollmentStatus: {
        type: 'string'
      },
      doe: {
        type: 'date'
      },
      availableFrom: {
        type: 'date'
      },
      availableTo: {
        type: 'date'
      },
      subjectEnrollment: {
        model: 'subjectenrollment'
      },
      scheduleStatus: {
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
      toJSON: SubjectScheduleModel.attributes.toJSON
    }

  });

})();

