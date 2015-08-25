/**
 * A virtual model representing a database view.
 * See config/db/collectioncentreoverview.sql for view definition.
 */
(function() {
  var CollectionCentreModel = require('./../CollectionCentre.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      username: {
        type: 'string'
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
        type: 'integer'
      },
      contactName: {
        type: 'text'
      },
      toJSON: CollectionCentreModel.attributes.toJSON
    }

  });

})();
