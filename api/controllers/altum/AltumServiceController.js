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
      // manually override model name for pagination in ok.js
      req.options.model = sails.models.altumprogramservices.identity;
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
          return servicedetail.find({
            statusName: 'Approved',
            visitable: true,
            altumServiceName: {
              "!": "Triage"
            }
          });
        })
        .then(function (approvedServices) {
          var that = this;
          if (approvedServices.length === 0) {
            // if no approved services yet, return only the Triage service.
            AltumService.findOne({name: "Triage"}).then(function (triageService) {
              that.referral.approvedServices = [
                {
                  referral: that.referral.id,
                  physician: that.referral.physician,
                  altumService: triageService.id,
                  altumServiceName: triageService.name,
                  serviceDate: new Date(),
                  approvalNeeded: false
                }
              ];
              res.ok(that.referral, {
                links: referraldetail.getResponseLinks(that.referral.id, that.displayName)
              });
            })

          } else {
            this.referral.approvedServices = approvedServices;
            res.ok(this.referral, {
              links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
            });
          }
        })
        .catch(res.badRequest);
    }
  }
})();
