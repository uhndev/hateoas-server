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
          return [
            // fetching available services
            altumprogramservices.find({ program: referral.program }).sort('altumServiceName ASC'),
            // fetching recommended services
            servicedetail.find({
              referral: referralID
            }).populate('visitService').sort('serviceDate ASC')
          ];
        })
        .spread(function (availableServices, services) {
          this.referral.availableServices = availableServices;
          this.referral.recommendedServices = services;
          this.referral.approvedServices = _.filter(services, {visitable: true});
          return res.ok(this.referral, {
            templateOverride: 'servicedetail',
            links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
          });
        })
        .catch(res.badRequest);
    },

    /**
     * bulkStatusChange
     * @description Custom endpoint that accepts multiple statuses and a type of status to create
     * @param req
     * @param res
     */
    bulkStatusChange: function (req, res) {
      var model = req.param('model');             // typeof approval, completion, or billingstatus
      var newStatuses = req.param('newStatuses'); // collection of status/service objects to create

      if (newStatuses.length && model) {
        return Promise.all(_.map(newStatuses, function (newStatus) {
          return sails.models[model].create(newStatus);
        })).then(function (newCreatedStatuses) {
          return res.ok(newCreatedStatuses);
        }).catch(function (err) {
          return res.serverError(err);
        });
      } else {
        return res.badRequest();
      }
    }
  };

})();
