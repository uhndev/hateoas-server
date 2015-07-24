(function() {
  var HateoasService = require('../services/HateoasService.js');
  var CollectionCentreModel = require('./CollectionCentre.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      id: {
        type: 'integer'
      },
      userEnrollments: {
        type: 'array'
      },
      coordinators_count: {
        type: 'integer'
      },
      subjects_count: {
        type: 'integer'
      },
      study: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      contact: {
        type: 'text'
      },
      createdAt: {
        type: 'date'
      },
      updatedAt: {
        type: 'date'
      },
      toJSON: CollectionCentreModel.attributes.toJSON
    }

  });

})();
