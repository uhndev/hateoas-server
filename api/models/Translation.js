/**
 * Translation
 *
 * @class Translation
 * @description Model representation of a translation.
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function() {
  var _super = require('./BaseModel.js');
  var HateoasService = require('../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultSortBy: 'translationKey ASC', // overrides BaseModel.defaultSortBy

    displayFields: ['language', 'translationKey'],

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
        unique: true,
        required: true
      },

      /**
       * translationKey
       * @description The translation key that should appear to correctly display the full language name
       * @type {String}
       */
      translationKey: {
        type: 'string',
        unique: true,
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

  });
})();
