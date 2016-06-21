/**
 * ReportStatus
 *
 * @class ReportStatus
 * @description Model representation of a ReportStatus
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
       * @description A reportStatus's approver
       * @type {Model}
       */
      approver: {
        model: 'approver'
      },

      /**
       * status
       * @description Status of reportStatus for service
       * @type {Model}
       */
      status: {
        model: 'status'
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
       * @description Reference to the service which requires reportStatus
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
     * @param  {Object}   values  given reportStatus object for creation
     * @param  {Function} cb      callback function on reportStatus
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
     * @description After creating a new service, determine the default starting reportStatus state
     * @param reportStatus
     * @param cb
     */
    afterCreate: function (reportStatus, cb) {
      Service.update({ id: reportStatus.service }, { currentReportStatus: reportStatus.id }).exec(function (err, updatedService) {
        cb(err);
      });
    },

    /**
     * afterUpdate
     * @description After adding a new reportStatus to a service via blueprint, we update the currentReportStatus
     * @param reportStatus
     * @param cb
     */
    afterUpdate: function (reportStatus, cb) {
      Service.update({ id: reportStatus.service }, { currentReportStatus: reportStatus.id }).exec(function (err, updatedService) {
        cb(err);
      });
    }

  });
})();

