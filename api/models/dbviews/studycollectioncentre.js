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
      toJSON: CollectionCentreModel.attributes.toJSON
    }

  });

})();

