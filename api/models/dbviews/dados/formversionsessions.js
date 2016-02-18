/**
 * A virtual model representing a database view.
 * See config/db/formversionsessions.sql for view definition.
 */
(function() {
  var FormVersionModel = require('./../../dados/FormVersion.js');
  var _super = require('./../baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      name: {
        type: 'string'
      },

      session: {
        model: 'session'
      },

      survey: {
        model: 'survey'
      },

      surveyVersion: {
        model: 'surveyversion'
      },

      sessionName: {
        type: 'string'
      },

      timepoint: {
        type: 'integer'
      },

      availableFrom: {
        type: 'integer'
      },

      availableTo: {
        type: 'integer'
      },

      type: {
        type: 'string'
      },

      formOrder: {
        type: 'array'
      },

      toJSON: FormVersionModel.attributes.toJSON
    }
  });

})();
