(function() {
  var SubjectModel = require('./../Subject.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes: {
      id: {
        type: 'integer'
      },
      userId: {
        type: 'integer'
      },
      collectionCentreId: {
        type: 'integer'
      },
      subjectNumber: {
        type: 'integer'
      },
      subjectenrollmentId: {
        type: 'integer'
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
      createdAt: {
        type: 'date'
      },
      updatedAt: {
        type: 'date'
      },
      toJSON: SubjectModel.attributes.toJSON
    }
  });

})();
