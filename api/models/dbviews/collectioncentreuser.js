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
      collectionCentre: {
        model: 'collectioncentre'
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
      userenrollment: {
        model: 'userenrollment'
      },
      centreAccess: {
        type: 'string'
      },
      toJSON: UserModel.attributes.toJSON
    }

  });

})();

