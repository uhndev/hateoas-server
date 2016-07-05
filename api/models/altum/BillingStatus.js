/**
 * BillingStatus
 *
 * @class BillingStatus
 * @description Model representation of a BillingStatus
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * approver
       * @description A billingStatus's approver
       * @type {Model}
       */
      approver: {
        model: 'approver'
      },

      /**
       * status
       * @description Status of billingStatus for service
       * @type {Model}
       */
      status: {
        model: 'status'
      },

      /**
       * paidDate
       * @description A claim/service should be considered Paid when reconciliation between a bank account to
       *              confirm deposit of payment for that service has been made
       * @type {Date}
       */
      paidDate: {
        type: 'datetime'
      },

      /**
       * deniedDate
       * @description A claim will be considered Denied when a response from the payor has been provided that
       *              it will not be accepted after either initial submission or resubmission
       * @type {Date}
       */
      deniedDate: {
        type: 'datetime'
      },

      /**
       * rejectedDate
       * @description A claim will be considered Rejected when an Error response from the payor has been provided.
       *              These services/claims should be returned in a List under a Claims in Error section/tab.
       *              Claims in Error can be reviewed, edited and Saved to Suspended or ReSubmitted or Suspended
       * @type {Date}
       */
      rejectedDate: {
        type: 'datetime'
      },

      /**
       * additionalData
       * @description JSON bucket where data collected from payor/programservice forms will reside
       * @type {JSON}
       */
      additionalData: {
        type: 'json'
      },

      /**
       * service
       * @description Reference to the service which requires billingStatus
       * @type {Model}
       */
      service: {
        model: 'service'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given billingStatus object for creation
     * @param  {Function} cb      callback function on billingStatus
     */
    beforeValidate: function (values, cb) {
      if (values.status) {
        Status.findOne(values.status).exec(function (err, status) {
          if (err) {
            cb(err);
          } else {
            values.displayName = status.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    },

    /**
     * afterCreate
     * @description After creating a new service, determine the default starting billingStatus state
     * @param billingStatus
     * @param cb
     */
    afterCreate: function (billingStatus, cb) {
      Service.update({ id: billingStatus.service }, { currentBillingStatus: billingStatus.id }).exec(function (err, updatedService) {
        cb(err);
      });
    },

    /**
     * afterUpdate
     * @description After adding a new billingStatus to a service via blueprint, we update the currentBillingStatus
     * @param billingStatus
     * @param cb
     */
    afterUpdate: function (billingStatus, cb) {
      Service.update({ id: billingStatus.service }, { currentBillingStatus: billingStatus.id }).exec(function (err, updatedService) {
        cb(err);
      });
    }

  });
})();

