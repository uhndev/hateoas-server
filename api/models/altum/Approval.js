/**
 * approval
 *
 * @class approval
 * @description Model representation of a approval
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
       * @description A approval's approver
       * @type {Model}
       */
      approver: {
        model: 'approver'
      },

      /**
       * status
       * @description Status of approval for service
       * @type {Model}
       */
      status: {
        model: 'status'
      },

      /**
       * service
       * @description Reference to the service which requires approval
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
     * @param  {Object}   values  given approval object for creation
     * @param  {Function} cb      callback function on completion
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
     * @description After creating a new service, determine the default starting approval state
     * @param approval
     * @param cb
     */
    afterCreate: function (approval, cb) {
      Service.update({ id: approval.service }, { currentApproval: approval.id }).exec(function (err, updatedService) {
        cb(err);
      });
    },

    /**
     * afterUpdate
     * @description After adding a new approval to a service via blueprint, we update the currentApproval
     * @param approval
     * @param cb
     */
    afterUpdate: function (approval, cb) {
      Service.update({ id: approval.service }, { currentApproval: approval.id }).exec(function (err, updatedService) {
        cb(err);
      });
    }

  });
})();

