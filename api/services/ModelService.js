/**
 * @namespace ModelService
 * @description Helper service for returning filtered data based on enrollments
 */

(function () {

  var _ = require('lodash');
  var _super = require('sails-permissions/dist/api/services/ModelService');

  function ModelService() {
  }

  ModelService.prototype = Object.create(_super);
  _.extend(ModelService.prototype, {

    /**
     * filterExpiredRecords
     * @description Performs find operation with filter for non-expired records.
     *              Will only perform filter if model definition includes an
     *              `expiredAt` attribute.
     * @param  {String} model Model name
     * @param  {Object} query Optional waterline query
     * @return {Promise}      Chainable model promise after find operation
     */
    filterExpiredRecords: function (model, query) {
      if (_.isUndefined(query) || _.isEmpty(query.where)) {
        query = {};
      }

      if (_.has(sails.models[model].definition, 'expiredAt')) {
        return sails.models[model].find(_.merge({expiredAt: null}, query));
      } else {
        return sails.models[model].find(query);
      }
    }

  });

  module.exports = new ModelService();
})();

