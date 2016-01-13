/**
 * ProgramServiceController
 *
 * @module  controllers/ProgramService
 * @description Server-side logic for managing ProgramService
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {
    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('programservice')
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));
      query.populate('serviceCategory');
      query.exec(function found(err, categories) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(categories);
      });
    }
  }
})();

