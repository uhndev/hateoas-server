/**
 * NoteType
 *
 * @class NoteType
 * @description Model representation of a NoteType
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      /**
       * name
       * @description A note type name
       * @type {string}
       */
      name: {
        type: 'string'
      },

      /**
       * name
       * @description A note type icon will show in html
       * @type {Model}
       */
      iconClass: {
        type: 'string'
      },

      /**
       * name
       * @description note collection
       * @type {Model}
       */
      notes: {
        collection: 'note',
        via: 'noteType'
      }

    },

    /**
     * generate
     * @description Overrides BaseModel.generate to provide fixed NoteTypes for generators.
     * @param state
     * @returns {Array}
     */
    generate: function (state) {
      return [
        {
          name: 'Internal',
          iconClass: 'internal-note'
        },
        {
          name: 'External',
          iconClass: 'external-note'
        },
        {
          name: 'SOAP',
          iconClass: 'soap-note'
        }
      ];
    }

  });
})();

