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
     * findBillableServices
     * @description Find method for returning services that were recommended for a referral
     * @param req
     * @param res
     * @returns {*}
     */
    findBillableServices: function (req, res) {
      var referralID = req.param('id');
      return referraldetail.findOne(referralID)
        .then(function (referral) {
          this.referral = referral;
          this.displayName = referral.client_displayName;
          return [
            // fetching available services
            altumprogramservices.find({ program: referral.program }).sort('altumServiceName ASC'),
            // fetching billable services
            servicedetail.find({
              referral: referralID,
              approvalVisitable: true
            }).populate('visitService').sort('serviceDate ASC'),
            // fetching visitable services
            servicedetail.find({
              referral: referralID,
              statusName: 'Approved',
              visitable: true
            })
          ];
        })
        .spread(function (availableServices, services, approvedServices) {
          this.referral.availableServices = availableServices;
          this.referral.recommendedServices = services;
          this.referral.approvedServices = approvedServices;
          return res.ok(this.referral, {
            templateOverride: 'servicedetail',
            links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
          });
        })
        .catch(res.badRequest);
    }
  };

})();
