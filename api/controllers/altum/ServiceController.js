/**
 * ServiceController
 *
 * @module  controllers/Service
 * @description Server-side logic for managing Services
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var _ = require('lodash');

  module.exports = {

    identity: 'Service',

    /**
     * findRecommendedServices
     * @description Find method for returning services that were recommended for a referral
     * @param req
     * @param res
     * @returns {*}
     */
    findRecommendedServices: function (req, res) {
      var referralID = req.param('id');
      return referraldetail.findOne(referralID)
        .then(function (referral) {
          this.referral = referral;
          this.displayName = referral.client_displayName;
          return servicedetail.find({referral: referralID}).populate('visitService').sort('serviceDate ASC');
        })
        .then(function (services) {
          this.referral.recommendedServices = services;
          return res.ok(this.referral, {
            templateOverride: 'servicedetail',
            links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
          });
        })
        .catch(res.badRequest);
    }
  };

})();
