/**
 * ServiceVariation
 *
 * @description A model representation of a service variation
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultTemplateOmit: ['displayName', 'variations', 'createdAt', 'createdBy', 'updatedAt'],

    attributes: {

      /**
       * name
       * @description Name of the service variation
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * variations
       * @description JSON configuration for possible variations
       */
      variations: {
        type: 'json',
        defaultsTo: [
          {
            "id": 1,
            "title": "Options",
            "nodes": [],
            "type": "none"
          }
        ]
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();
