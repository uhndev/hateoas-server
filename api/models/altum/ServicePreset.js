/**
 * ServicePreset
 *
 * @class ServicePreset
 * @description Model representation of a service group preset
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
       * @description A preset name
       * @type {String}
       */
      name: {
        type: 'string',
        unique: true,
        required: true
      },

      /**
       * preset
       * @description Array containing group and field configuration
       * @type {JSON}
       */
      preset: {
        type: 'json',
        required: true
      },

      /**
       * program
       * @description Related program
       * @type {Model}
       */
      program: {
        model: 'program'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();


