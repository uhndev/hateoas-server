(function() {
  var HateoasService = require('../services/HateoasService.js');
  var UserModel = require('./User.js');

  module.exports = {
    migrate: 'safe',

    attributes: {
      id: {
        type: 'integer'
      },
      enrollmentId: {
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
      studyName: {
        type: 'string'
      },
      collectionCentre: {
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
      expiredAt: {
        type: 'date'
      },
      toJSON: UserModel.attributes.toJSON
    }
  }
})();

