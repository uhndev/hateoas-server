/**
 * ServiceCategoryController
 *
 * @module  controllers/ServiceCategory
 * @description Server-side logic for managing ServiceCategory
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {
    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('servicecategory')
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));
      query.populate('');
      query.exec(function found(err, categories) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(categories);
      });
    }
  }
})();
