/**
 * PayorController
 *
 * @description :: Server-side logic for managing payors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
(function() {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  module.exports = {
    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('payor')
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));
      query.populate('company');
      query.exec(function found(err, sites) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(sites);
      });
    }
  }
})();

