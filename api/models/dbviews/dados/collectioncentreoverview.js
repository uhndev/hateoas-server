/**
 * A virtual model representing a database view.
 * See config/db/collectioncentreoverview.sql for view definition.
 */
(function() {
  var CollectionCentreModel = require('./../../dados/CollectionCentre.js');
  var _super = require('./dadosBaseView.js');

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
        type: 'text'
      },
      toJSON: CollectionCentreModel.attributes.toJSON
    }

  });

})();
