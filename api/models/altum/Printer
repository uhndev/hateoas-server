/**
 * printer model for Altum printers
 */

(function () {
  var _super = require('./AltumBaseModel.js');

  _.merge(exports, _super);
  _.merge(exports, {
    defaultTemplateOmit: null,

    attributes: {

      /**
       * printer name
       */
      name: {
        type: 'string'
      },
      /**
       * printer IP Address
       */
      IP: {
        type: 'string'
      },

      /**
       * site which the printer in
       */
      site: {
        model: 'site'
      },

      /**
       * printer type
       */
      printerType: {
        type: 'string'
      },
      /**
       * printer location
       */
      location: {
        type: 'string'
      }
    }
  })
})();
