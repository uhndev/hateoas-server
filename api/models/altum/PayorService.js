/**
 * PayorService.js
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
     * availableService
     * @description a payorService's availableService
     * @type {String}
     */

    availableService: {
      model: 'availableService'
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

