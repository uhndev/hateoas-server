/**
 * ProgramService
 *
 * @class ProgramService
 * @description A model of AltumServices, used for populating/organizing services on the altum side during daily operations
 *              and represents the available services that Altum provides.  Further specification is done in ProgramService
 *              where an example of an Altum Service can be CT SCAN, then a sample Program Service would be CT SCAN - HEAD.
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description a programService's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * program
       * @description a programService's program (at altum), only for driving dropdowns
       * @type {String}
       */
      program: {
        model: 'program'
      },

      /**
       * price
       * @description a programService's billing max price for a service
       * @type {Integer}
       */
      price: {
        type: 'integer'
      },

      /**
       * AHServices
       * @description an AvailableService's AHServices
       * @type {Collection}
       */
      AHServices: {
        collection: 'altumservice',
        via: 'programServices',
        dominant: true
      },

      /**
       * payor
       * @description a programService's payor
       * @type {String}
       */
      payor: {
        model: 'payor'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

