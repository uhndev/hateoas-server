/**
 * AvailableService.js
 *
 * @description :: a model of AvailableServices mapping payor services to altum services. used exclusively for driving drop downs
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
     *
     * @description an AvailableService's AltumService
     * @type {model}
     */

    altumService: {
      model: 'altumService'
    },

    /**
     * payor
     * @description an AvailableSerivces payor
     * @type {model}
     */

    payor: {
      model: 'payor'
    },


    /**
     * payorService
     * @description an AvailableService's payorService
     * @type {model}
     */

    payorService: {
      model: 'payorService'
    },


    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();

