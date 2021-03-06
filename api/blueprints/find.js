/**
 * Module dependencies
 */

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */
(function() {
  var _ = require('lodash');
  var Promise = require('bluebird');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = function findRecords(req, res) {

    // Look up the model
    var Model = actionUtil.parseModel(req);

    // If an `id` param was specified, use the findOne blueprint action
    // to grab the particular instance with its primary key === the value
    // of the `id` param.   (mainly here for compatibility for 0.9, where
    // there was no separate `findOne` action)
    if (actionUtil.parsePk(req)) {
      return require('../../node_modules/sails/lib/hooks/blueprints/actions/findOne')(req, res);
    }

    // Lookup for records that match the specified criteria that are not expired
    var query = (_.has(Model.definition, 'expiredAt')) ? Model.find({expiredAt: null}) : Model.find();

    // if not given any request params in req, use defaults found in Model
    query
      .where(actionUtil.parseCriteria(req) || Model.defaultQuery || undefined)
      .limit(actionUtil.parseLimit(req) || Model.defaultLimit || BaseModel.defaultLimit)
      .skip(actionUtil.parseSkip(req) || Model.defaultSkip || BaseModel.defaultSkip)
      .sort(actionUtil.parseSort(req) || Model.defaultSortBy || undefined);

    query = actionUtil.populateRequest(query, req);

    // auto-populate based on Model.defaultPopulate
    if (Model.defaultPopulate) {
      query = query.populate(Model.defaultPopulate);
    }

    /**
     * if header was sent from frontend (a query from getQueryLinks), apply populate here
     * with appropriate where clause for populate to get correct filtered count.
     *
     * Header is set in HateoasController.js in dados-client and
     * queryLinks are defined within the respective Model file in Sails.
     */
    var queryFilter = null;
    if (_.has(req.headers, 'x-uhn-deep-query')) {
      queryFilter = JSON.parse(req.headers['x-uhn-deep-query']);
      query = query.populate(queryFilter.collection, queryFilter.where);
    }

    query.exec(function found(err, matchingRecords) {
      if (err) return res.serverError(err);

      // Only `.watch()` for new instances of the model if
      // `autoWatch` is enabled.
      if (req._sails.hooks.pubsub && req.isSocket) {
        Model.subscribe(req, matchingRecords);
        if (req.options.autoWatch) {
          Model.watch(req);
        }
        // Also subscribe to instances of all associated models
        _.each(matchingRecords, function (record) {
          actionUtil.subscribeDeep(req, record);
        });
      }

      // if header was included with populate query, filter matchingRecords by given successful matched criteria
      if (queryFilter) {
        res.ok(_.filter(matchingRecords, function (record) {
          return record[queryFilter.collection].length > 0;
        }));
      } else {
        res.ok(matchingRecords);
      }
    });
  };

})();
