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
        .populate('staff')
        .then(function (referral) {
          this.referral = referral;
          this.displayName = referral.client_displayName;
          var query = altumprogramservices.find({ program: referral.program }).sort('altumServiceName ASC');
          return (!_.isEmpty(criteria) && !_.has(criteria, 'id')) ? query.where(criteria) : query;
        })
        .then(function (services) {
          var that = this;
          this.referral.availableServices = services;
          return [
            servicedetail.find({
              referral: this.referral.id,
              approvalVisitable: true,
              completionVisitable: true,
              visitable: true,
              altumServiceName: {
                "!": "Triage"
              }
            }),
            AltumService.findOne({name: "Triage"}).then(function (triageService) {
              that.triageService = triageService;
              return ProgramService.findOrCreate({
                name: "Triage",
                program: that.referral.program,
                payor: that.referral.payor
              }, {
                name: "Triage",
                program: that.referral.program,
                AHServices: [triageService.id],
                payor: that.referral.payor,
                approvalNeeded: false
              })
            }).then(function (triageProgramService) {
              return Service.findOrCreate({
                referral: that.referral.id,
                altumService: that.triageService.id
              }, {
                referral: that.referral.id,
                physician: that.referral.physician,
                altumService: that.triageService.id,
                programService: triageProgramService.id,
                serviceDate: new Date(),
                approvalNeeded: false,
                createdBy: req.user.id
              });
            })
          ]
        })
        .spread(function (approvedServices, existingTriageService) {
          if (approvedServices.length === 0) {
            // set initial visit service as just the starting triage service
            this.referral.approvedServices = [
              _.merge(existingTriageService, {altumServiceName: existingTriageService.displayName})
            ];

            res.ok(this.referral, {
              links: referraldetail.getResponseLinks(this.referral.id, this.displayName)
            });
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
