/**
 * InvoiceService
 *
 * @description A model representation of a service, and instance of actual work being done at altum
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
       * invoice
       * @description an invoiceService's associated invoice
       * @type {Model}
       */
      invoice: {
        model: 'invoice'
      },

      /**
       * service
       * @description an invoiceService's associated service
       * @type {Model}
       */
      service: {
        model: 'service'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

