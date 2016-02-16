/**
 * AltumServiceController
 *
 * @module  controllers/altumService
 * @description Server-side logic for managing AltumService
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  module.exports = {
    identity: 'AltumService',

    /**
     * findAvailableServices
     * @description Finds one referral's available services with site information
     */
    findAvailableServices: function (req, res) {
      var criteria = actionUtil.parseCriteria(req);
      referraldetail.findOne(req.param('id'))
        .then(function (referral) {
          this.referral = referral;
          this.displayName = referral.client_displayName;
          var query = altumprogramservices.find({ program: referral.program });
          return (!_.isEmpty(criteria) && !_.has(criteria, 'id')) ? query.where(criteria) : query;
        })
        .then(function (services) {
          this.referral.availableServices = services;
          res.ok(this.referral, {
            links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
          });
        })
        .catch(res.badRequest);
    }
  }
})();
