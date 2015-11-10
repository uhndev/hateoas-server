/**
 * ReferralController
 *
 * @module  controllers/Referral
 * @description Server-side logic for managing Referrals
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {

  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {

    find: function (req, res, next) {
      var query = ModelService.filterExpiredRecords('referral')
        .where(actionUtil.parseCriteria(req))
        .limit(actionUtil.parseLimit(req))
        .skip(actionUtil.parseSkip(req))
        .sort(actionUtil.parseSort(req));
      query.populate('payors');
      query.exec(function found(err, sites) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(sites);
      });
    }
  };
})();
