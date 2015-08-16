/**
 * A virtual model representing a database view.
 * See config/db/studysubject.sql for view definition.
 */
(function() {
  var SubjectEnrollmentModel = require('./../SubjectEnrollment.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      subjectId: {
        type: 'integer'
      },
      userId: {
        type: 'integer'
      },
      collectionCentre: {
        type: 'integer'
      },
      subjectNumber: {
        type: 'integer'
      },
      studyName: {
        type: 'string'
      },
      collectionCentreName: {
        type: 'string'
      },
      studyAttributes: {
        type: 'json'
      },
      studyMapping: {
        type: 'json'
      },
      status: {
        type: 'string'
      },
      doe: {
        type: 'date'
      },
      toJSON: SubjectEnrollmentModel.attributes.toJSON
    }

  });

})();

