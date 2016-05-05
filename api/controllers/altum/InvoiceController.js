/**
 * InvoiceController
 *
 * @module  controllers/Invoice
 * @description Server-side logic for managing Invoices
 * @help        See http://links.sailsjs.org/docs/controllers
 */

(function () {
  var actionUtil = require('../../../node_modules/sails/lib/hooks/blueprints/actionUtil');
  var _ = require('lodash');

  module.exports = {

    identity: 'Invoice',

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
          return [
            servicedetail.find({referral: referralID}).populate('visitService').sort('serviceDate ASC'),
            servicedetail.find({
              referral: referralID,
              statusName: 'Approved',
              visitable: true
            })
          ];
        })
        .spread(function (services, approvedServices) {
          this.referral.recommendedServices = services;
          this.referral.approvedServices = approvedServices;
          return res.ok(this.referral, {
            links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
          });
        })
        .catch(res.badRequest);
    }
  };

})();
