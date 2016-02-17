/**
 * A virtual model representing a database view.
 * See config/db/collectioncentresubjectoverview.sql for view definition.
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
        model: 'study'
      },
      name: {
        type: 'string'
      },
      contact: {
        model: 'user'
      },
      contactName: {
        type: 'text'
      },
      toJSON: CollectionCentreModel.attributes.toJSON
    }

  });

})();
