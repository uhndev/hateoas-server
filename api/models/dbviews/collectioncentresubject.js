/**
 * A virtual model representing a database view.
 * See config/db/collectioncentresubject.sql for view definition.
 */
(function() {
  var SubjectModel = require('./../Subject.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes: {
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
      toJSON: SubjectModel.attributes.toJSON
    }
  });

})();
