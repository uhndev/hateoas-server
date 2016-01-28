/**
 * ProgramService
 *
 * @class ProgramService
 * @description A model representation of a program service.  An example of this would be CT SCAN - HEAD
 *              which would link to both a specific program (i.e. Head and Neck) and parent Altum Service
 *              (i.e. CT SCAN).  A program service essentially serves as the link between the billing side
 *              of the application via payors and the assessment/recommendations side via program and altumService.
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
       * @description a payorService's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * program
       * @description a payorService's program (at altum), only for driving dropdowns
       * @type {String}
       */
      program: {
        model: 'program'
      },

      /**
       * price
       * @description a payor's billing max price for a service
       * @type {Integer}
       */
      price: {
        type: 'integer'
      },

      /**
       * altumService
       * @description a payorService's mapping to it's altumService
       * @type {String}
       */
      altumService: {
        model: 'altumservice'
      },

      /**
       * payor
       * @description a payorService's payor
       * @type {String}
       */
      payor: {
        model: 'payor'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

