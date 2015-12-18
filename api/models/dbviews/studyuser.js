/**
 * A virtual model representing a database view.
 * See config/db/studyuser.sql for view definition.
 */
(function() {
  var UserModel = require('./../User.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      userenrollment: {
        model: 'userenrollment'
      },
      userEnrollments: {
        type: 'array'
      },
      username: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      prefix: {
        type: 'string'
      },
      firstname: {
        type: 'string'
      },
      lastname: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      dob: {
        type: 'date'
      },
      study: {
        type: 'model'
      },
      studyName: {
        type: 'string'
      },
      collectionCentre: {
        model: 'collectioncentre'
      },
      collectionCentreName: {
        type: 'string'
      },
      centreAccess: {
        type: 'string'
      },
      toJSON: UserModel.attributes.toJSON
    }

  });

})();

