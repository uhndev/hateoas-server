/**
 * A virtual model representing a database view.
 * See config/db/studycollectioncentre.sql for view definition.
 */
(function() {
  var CollectionCentreModel = require('./../../dados/CollectionCentre.js');
  var _super = require('./../baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      userenrollment: {
        model: 'userenrollment'
      },
      study: {
        model: 'study'
      },
      studyName: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      contact: {
        model: 'user'
      },
      contactName: {
        type: 'string'
      },
      toJSON: CollectionCentreModel.attributes.toJSON
    }

  });

})();

