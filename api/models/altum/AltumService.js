/**
 * AvailableService.js
 *
 * @description :: a model of AvailableServices, used for populating/organizing services on the altum side during daily operations
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
     * @description an AltumService's name
     * @type {model}
     */

    name: {
      type: 'string'
    },

    /**
     * payorService
     * @description an AvailableService's payorService
     * @type {collection}
     */

    programServices: {
      collection: 'programService',
      via: 'altumService'
    },


    /**
     * available
     * @description an AvailableService's payorService
     * @type {model}
     */

    available: {
      type: 'boolean'
    },

    /**
     * sites
     * @description a collection of a site's where the altumService is offered
     * @type {integer}
     */

    sites: {
      collection:'site',
      via: 'altumServices'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();

