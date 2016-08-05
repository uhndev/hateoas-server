/**
 * Created by calvinsu on 2016-08-02.
 */
/**
 * This the label type
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
       * @description a labe type name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * name
       * @description a printer's location
       * @type {String}
       */
      ZPL: {
        type: 'string'
      }
    }
  })
})();
