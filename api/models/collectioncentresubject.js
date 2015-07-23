(function() {
  var HateoasService = require('../services/HateoasService.js');
  var SubjectModel = require('./Subject.js');

  module.exports = {
    migrate: 'safe',

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
  }
})();
