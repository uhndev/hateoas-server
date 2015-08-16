/**
 * A virtual model representing a database view.
 * See config/db/collectioncentreuser.sql for view definition.
 */
(function() {
  var UserModel = require('./../User.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      collectionCentreId: {
        type: 'integer'
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
      userenrollmentId: {
        type: 'integer'
      },
      centreAccess: {
        type: 'string'
      },
      toJSON: UserModel.attributes.toJSON
    }

  });

})();

