/**
 * Translation
 *
 * @class Translation
 * @description Model representation of a translation.
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function() {
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {

    connection: 'dados_cache',
    schema: true,
    attributes: {

      /**
       * language
       * @description The language for which this translation applies to
       * @type {String}
       */
      language: {
        type: 'string',
        enum: sails.config.i18n.locales,
        required: true
      },

      /**
       * translation
       * @description The json body of translation file at <path>/<part>-<language>.json
       * @type {Object}
       */
      translation: {
        type: 'json',
        required: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  };

})();
