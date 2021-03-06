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
          .populate(['staff', 'approvals', 'completion', 'billingStatuses', 'reportStatuses'])
          .then(function (templateService) {
            var services = [];
            var templatedService = {};

            // only create services after 1st service, so we don't get redundant services
            for (var i=1; i <= billingGroup.totalItems; i++) {
              delete templatedService.id;
              templatedService = _.cloneDeep(templateService);
              templatedService.itemCount = i;
              templatedService.billingGroupItemLabel = templateService.displayName + " " + i;
              templatedService.billingGroup = billingGroup.id;
              templatedService.createdBy = billingGroup.createdBy;
              // service with itemCount === 1 will come from templateService
              if (i > 1) {
                delete templatedService.id;
              }
              services.push(templatedService);
            }

            return [
              // update itemCount, labels for first service coming from templateService
              Service.update({id: billingGroup.templateService}, _.first(services)),
              // create repeated services if applicable
              services.length ? Service.create(_.tail(services)) : []
            ];
          })
          .spread(function (templateService, createdServices) {
            return BillingGroup.update({id: billingGroup.id}, {name: templateService.displayName});
          })
          .then(function(updatedBillingGroup) {
            return cb();
          })
          .catch(cb);
      } else {
        cb();
      }
    }

  });
})();
