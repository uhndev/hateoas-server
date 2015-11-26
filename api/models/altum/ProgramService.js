/**
 * ProgramSerivce.js
 *
 * @description :: a model representation of payor services
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

  attributes: {

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
     * @type {integer}
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
      model: 'altumService'
    },

    /**
     * serviceCategory
     * @description a ProgramService's mapping to it's serviceCategory
     * @type {model}
     */

    serviceCategory: {
      model: 'serviceCategory'
    },

    /**
     * payor
     * @description a payorService's payor
     * @type {String}
     */

    payor: {
      model: 'payor'
    },

    /**
     * program
     * @description a payorService's associated program
     * @type {String}
     */

    program: {
      model: 'program'
    },
    /**
     * name
     * @description a payorService's name
     * @type {String}
     */

    name: {
      type: 'string'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();

