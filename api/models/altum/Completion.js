/**
 * Completion
 *
 * @class Completion
 * @description Model representation of a Completion
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
       * @description A completion's approver
       * @type {Model}
       */
      approver: {
        model: 'approver'
      },

      /**
       * status
       * @description Status of completion for service
       * @type {Model}
       */
      status: {
        model: 'status'
      },

      /**
       * cancellationDate
       * @description Cancellation date if applicable for this completion
       * @type {Date}
       */
      cancellationDate: {
        type: 'date'
      },

      /**
       * completionDate
       * @description Completion date if applicable for this completion
       * @type {Date}
       */
      completionDate: {
        type: 'date'
      },

      /**
       * service
       * @description Reference to the service which requires completion
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
     * @param  {Object}   values  given completion object for creation
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
     * @description After creating a new service, determine the default starting completion state
     * @param completion
     * @param cb
     */
    afterCreate: function (completion, cb) {
      Service.update({ id: completion.service }, { currentCompletion: completion.id }).exec(function (err, updatedService) {
        cb(err);
      });
    },

    /**
     * afterUpdate
     * @description After adding a new completion to a service via blueprint, we update the currentCompletion
     * @param completion
     * @param cb
     */
    afterUpdate: function (completion, cb) {
      Service.update({ id: completion.service }, { currentCompletion: completion.id }).exec(function (err, updatedService) {
        cb(err);
      });
    }

  });
})();

