(function() {
  var SubjectEnrollmentModel = require('./../SubjectEnrollment.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      id: {
        type: 'integer'
      },
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
      doe: {
        type: 'date'
      },
      createdAt: {
        type: 'date'
      },
      updatedAt: {
        type: 'date'
      },
      toJSON: SubjectEnrollmentModel.attributes.toJSON
    }

  });

})();

