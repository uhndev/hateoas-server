/**
 * Service.js
 *
 * @description :: a model representation of a service, and instance of actual work being done at altum
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
     * referral
     * @description a service's associated referral
     * @type {model}
     */

    referral: {
      model: 'referral'
    },

    /**
     * payorService
     * @description a serivce's associated payorService
     * @type {model}
     */

    payorService: {
      model: 'payorService'
    },

    /**
     * serviceProviders
     * @description a collection of a serivce's associated provider
     * @type {collection}
     */

    serviceProviders: {
      collection: 'user'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();

