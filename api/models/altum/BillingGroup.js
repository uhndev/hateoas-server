/**
 * BillingGroup
 *
 * @description A model representation of a billing group
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var Promise = require('bluebird');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description The (optional) name of the billing group
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * billingGroupName
       * @description The auto-generated name of the billing group corresponding to the templateService
       * @type {String}
       */
      billingGroupName: {
        type: 'string'
      },

      /**
       * templateService
       * @description The reference to the service that will be used to stamp out this group's services
       * @type {Model}
       */
      templateService: {
        model: 'service'
      },

      /**
       * services
       * @description Collection of bucketed services under this BillingGroup
       * @type {Collection}
       */
      services: {
        collection: 'service',
        via: 'billingGroup'
      },

      /**
       * itemCount
       * @description Number denoting the optional sequence in the BillingGroup
       * @type {Number}
       */
      totalItems: {
        type: 'integer',
        defaultsTo: 1
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * afterCreate
     * @description After creating billingGroup, we stamp out however many Services based on totalItems
     *              so that if we create a BillingGroup with templateService and totalItems set to 5,
     *              There should be 5 templateServices with incrementing itemCount and billingGroupItemLabel;
     * @param billingGroup
     * @param cb
     */
    afterCreate: function(billingGroup, cb) {
      if (billingGroup.templateService && billingGroup.totalItems) {
        return Service.findOne({id: billingGroup.templateService})
          .populate('staff')
          .then(function (templateService) {
            var services = [];
            var templatedService = {};

            // only create services after 1st service, so we don't get redundant services
            // service with itemCount === 1 will come from templateService
            for (var i=2; i <= billingGroup.totalItems; i++) {
              delete templatedService.id;
              templatedService = _.cloneDeep(templateService);
              templatedService.itemCount = i;
              templatedService.billingGroupItemLabel = templateService.displayName + " " + i;
              templatedService.billingGroup = billingGroup.id;
              delete templatedService.id;
              services.push(templatedService);
            }

            return [
              templateService,
              Service.create(services),
              Referral.findOne(templateService.referral)
            ];
          })
          .spread(function (templateService, createdServices, referral) {
            // create list of created services with original template service prepended to array
            var serviceIDs = [templateService.id].concat(_.map(createdServices, 'id'));
            referral.services.add(serviceIDs);

            return [
              BillingGroup.update({id: billingGroup.id}, {
                name: templateService.displayName,
                services: serviceIDs
              }),
              referral.save()
            ];
          })
          .spread(function(updatedBillingGroup, updatedReferral) {
            return cb();
          })
          .catch(cb);
      } else {
        cb();
      }
    }

  });
})();
