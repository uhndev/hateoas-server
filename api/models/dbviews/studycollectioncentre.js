/**
 * A virtual model representing a database view.
 * See config/db/studycollectioncentre.sql for view definition.
 */
(function() {
  var CollectionCentreModel = require('./../CollectionCentre.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      id: {
        type: 'integer'
      },
      userenrollmentId: {
        type: 'integer'
      },
      study: {
        type: 'integer'
      },
      studyName: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      contact: {
        type: 'integer'
      },
      contactName: {
        type: 'string'
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

