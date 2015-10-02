/**
 * SiteController
 *
 * @module  controllers/Subject
 * @description Server-side logic for managing Sites
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('site')
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));
      query.populate('address');
      query.exec(function found(err, sites) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(sites);
      });
    }
  }
})();
