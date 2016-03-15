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

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

