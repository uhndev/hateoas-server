/**
 * A virtual model representing a database view.
 * See config/db/collectioncentresubject.sql for view definition.
 */
(function() {
  var SubjectModel = require('./../../dados/Subject.js');
  var _super = require('./dadosBaseView.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes: {
      user: {
        model: 'user'
      },
      collectionCentre: {
        model: 'collectioncentre'
      },
      subjectNumber: {
        type: 'integer'
      },
      subjectenrollment: {
        model: 'subjectenrollment'
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
