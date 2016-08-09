/**
 * Printer
 *
 * @class Printer
 * @description Model representation of a Printer
 */

(function () {
  var _super = require('./AltumBaseModel.js');

  _.merge(exports, _super);
  _.merge(exports, {
    
    defaultTemplateOmit: null,

    attributes: {

      /**
       * name
       * @description a printer's name
       * @type {String}
       */
      name: {
        type: 'string'
      },
      
      /**
       * IP
       * @description a printer's IP
       * @type {String}
       */
      IP: {
        type: 'string'
      },

      /**
       * name
       * @description which Altum site the printer in
       * @type {String}
       */
      site: {
        model: 'site'
      },

      /**
       * name
       * @description a printer's type
       * @type {String}
       */
      printerType: {
        type: 'string'
      },
      
      /**
       * name
       * @description a printer's location
       * @type {String}
       */
      location: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  })
})();
