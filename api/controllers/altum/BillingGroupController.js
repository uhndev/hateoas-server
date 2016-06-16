/**
 * BillingGroupController
 *
 * @module  controllers/BillingGroup
 * @description Server-side logic for managing billing groups
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function() {
  module.exports = {
    identity: 'BillingGroup',

    /**
     * bulkRecommendServices
     * @description Custom endpoint that accepts multiple services to recommend
     * @param req
     * @param res
     */
    bulkRecommendServices: function (req, res) {
      var newBillingGroups = req.param('newBillingGroups'); // collection of service objects to create

      if (newBillingGroups.length) {
        return Promise.all(_.map(newBillingGroups, function (newBillingGroup) {
          return BillingGroup.create(newBillingGroup);
        })).then(function (newBillingGroups) {
          return res.ok(newBillingGroups);
        }).catch(function (err) {
          return res.serverError(err);
        });
      } else {
        return res.badRequest();
      }
    }
    
  };
})();
