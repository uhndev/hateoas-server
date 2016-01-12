/**
 * Service.js
 *
 * @description :: a model representation of a service, and instance of actual work being done at altum
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * referral
       * @description a service's associated referral
       * @type {Model}
       */

      referral: {
        model: 'referral'
      },

      /**
       * programService
       * @description a serivce's associated programService
       * @type {Model}
       */

      programService: {
        model: 'programService'
      },

      /**
       * serviceProviders
       * @description a collection of a service's associated providers
       * @type {Collection}
       */

      serviceProviders: {
        collection: 'user'
      },

      /**
       * approved
       * @description presently this is just a boolean to flag it as approved
       * @type {boolean}
       */

      approved: {
        type: 'boolean',
        defaultsTo: false
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();

