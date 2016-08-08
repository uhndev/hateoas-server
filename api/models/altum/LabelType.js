/**
 * LabelType
 *
 * @class LabelType
 * @description Model representation of a LabelType
 */

(function () {
  var _super = require('./AltumBaseModel.js');

  _.merge(exports, _super);
  _.merge(exports, {
    defaultTemplateOmit: null,

    attributes: {

      /**
       * name
       * @description A label type name
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
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  })
})();
