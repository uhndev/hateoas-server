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
        type: 'string',
        unique: true
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
       * backgroundColour
       * @description Background colour of the notetype
       */
      backgroundColour: {
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
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
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
    },

    generateAndCreate: function (state) {
      var notetypes = this.generate();
      return Promise.all(
        _.map(notetypes, function (notetype) {
          return NoteType.findOrCreate({name: notetype.name}, notetype);
        })
      ).then(function (notetypes) {
        sails.log.info(notetypes.length + " noteType(s) generated");
      });
    }

  });
})();

