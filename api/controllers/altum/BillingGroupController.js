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
      var billingGroupID = req.param('billingGroup');       // existing billingGroup to add services to
      var newBillingGroups = req.param('newBillingGroups'); // collection of service objects to create

      if (newBillingGroups.length) {
        return Promise.all(_.map(newBillingGroups, function (newBillingGroup) {
          if (billingGroupID) {
            var services = [];
            var templatedService = {};

            // create however many service objects as was determined by totalItems
            for (var i=1; i <= newBillingGroup.totalItems; i++) {
              templatedService = _.cloneDeep(newBillingGroup.templateService);
              templatedService.itemCount = i;
              templatedService.billingGroupItemLabel = newBillingGroup.templateService.name + " " + i;
              templatedService.billingGroup = billingGroupID;
              services.push(templatedService);
            }

            // create repeated services if applicable
            return services.length ? Service.create(services) : null;
          } else {
            return BillingGroup.create(newBillingGroup);
          }
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
