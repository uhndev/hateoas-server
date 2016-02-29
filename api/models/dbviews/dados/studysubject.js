/**
 * A virtual model representing a database view.
 * See config/db/studysubject.sql for view definition.
 */
(function() {
  var SubjectEnrollmentModel = require('./../../dados/SubjectEnrollment.js');
  var _super = require('./dadosBaseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      subject: {
        model: 'subject'
      },
      user: {
        model: 'user'
      },
      displayName: {
        type: 'string'
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
      studyAttributes: {
        type: 'json'
      },
      providers: {
        type: 'array'
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

