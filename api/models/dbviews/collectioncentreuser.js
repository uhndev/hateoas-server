(function() {
  var UserModel = require('./../User.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      id: {
        type: 'integer'
      },
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
      createdAt: {
        type: 'date'
      },
      updatedAt: {
        type: 'date'
      },
      toJSON: UserModel.attributes.toJSON
    }

  });

})();

