/**
 * Invoice
 *
 * @description A model representation of an invoice
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * referral
       * @description Reference to the referral for which this invoice refers to
       * @type {Model}
       */
      referral: {
        model: 'referral'
      },

      /**
       * payor
       * @description an invoice's associated payor
       * @type {Model}
       */
      payor: {
        model: 'payor'
      },

      /**
       * invoiceServices
       * @description a collection of an invoices billed for services
       * @type {Collection}
       */
      invoiceServices: {
        collection: 'invoiceService',
        via: 'invoice'
      },

      /**
       * status
       * @description Status of Invoice stages - will be managed by an external process
       * @type {String}
       */
      status: {
        type: 'string',
        enum: ['Pending', 'Processing', 'Processed', 'Voided'],
        defaultsTo: 'Pending'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

