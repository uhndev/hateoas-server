/**
 * StatusForm
 *
 * @class StatusForm
 * @description Model representation of a StatusForm
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var Promise = require('bluebird');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: ['createdAt', 'createdBy', 'updatedAt'],

    attributes: {

      /**
       * status
       * @description Reference to the status for which this systemform should appear
       * @type {Model}
       */
      status: {
        model: 'status'
      },

      /**
       * payor
       * @description Reference to the payor for which this statusform should be active.
       * @type {Model}
       */
      payor: {
        model: 'payor'
      },

      /**
       * altumservice
       * @description Reference to the altumservice for which this statusform should be active.
       *              If set, takes precedence over payor.
       * @type {Model}
       */
      altumservice: {
        model: 'altumservice'
      },

      /**
       * programservice
       * @description Reference to the programservice for which this statusform should be active.
       *              If set, takes precedence over altumservice.
       * @type {Model}
       */
      programservice: {
        model: 'programservice'
      },

      /**
       * systemform
       * @description Reference to systemform containing data to capture when changing status
       * @type {Model}
       */
      systemform: {
        model: 'systemform'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given statusform object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      var promises = [];

      _.each(['status', 'payor', 'altumservice', 'programservice', 'systemform'], function (key) {
        if (values[key]) {
          promises.push(sails.models[key].findOne(_.has(values[key], 'id') ? values[key].id : values[key]));
        } else {
          promises.push(null);
        }
      });

      // builds displayName via: <STATUS> | (<PAYOR> || <ALTUMSERVICE> || <PROGRAMSERVICE>) | <SYSTEMFORM>
      return Promise.all(promises).spread(function (status, payor, altumService, programService, systemform) {
        values.displayName = _.map(_.filter([
          status,
          payor,
          altumService,
          programService,
          systemform
        ]), 'displayName').join(' | ');
        cb();
      }).catch(cb);
    }

  });
})();

