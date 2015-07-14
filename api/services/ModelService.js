/**
 * @namespace ModelService
 * @description Helper service for returning filtered data based on enrollments
 */

(function() {

  var _ = require('lodash');
  var _super = require('sails-permissions/api/services/ModelService');

  function ModelService () { }

  ModelService.prototype = Object.create(_super);
  _.extend(ModelService.prototype, {

    /**
     * filterExpiredRecords
     * @description Performs find operation with filter for non-expired records.
     *              Will only perform filter if model definition includes an
     *              `expiredAt` attribute.
     * @param  {String} model Model name
     * @return {Promise}      Chainable model promise after find operation
     */
    filterExpiredRecords: function(model) {
      if (_.has(sails.models[model].definition, 'expiredAt')) {
        return sails.models[model].find({ expiredAt: null });
      } else {
        return sails.models[model].find();
      }
    },

    // TODO
    queryOnPopulated: function(model, options, populatedModel) {
      var Model = sails.models[model];

      sails.models[populatedModel].find(query)
        .then(function (records) {
          // if query applies to populated model, return primary model search
          // with association ids as an or clause to original model
          if (records) {
            var popIds = _.pluck(records, 'id');
            var popQuery = {};
            popQuery[populatedModel] = popIds
            return sails.models[model].find(popQuery);
          }
          // otherwise, we try on the base model with query
          else {
            return sails.models[model].find(query);
          }
        });
    }

  });

  module.exports = new ModelService();
})();

