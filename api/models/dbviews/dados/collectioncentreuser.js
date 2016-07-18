/**
 * A virtual model representing a database view.
 * See config/db/collectioncentreuser.sql for view definition.
 */
(function() {
  var UserModel = require('./../../User.js');
  var _super = require('./dadosBaseView.js');

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
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      dateOfBirth: {
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

