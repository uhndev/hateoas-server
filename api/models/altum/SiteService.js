/**
 * SiteService.js
 *
 * @description :: a model of Site Services, used for populating/organizing services on the altum side during daily operations
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
       * altumService
       * @description an SiteService's altumService
       * @type {Model}
       */
      altumService: {
        model: 'altumService'
      },

      /**
       * site
       * @description an AvailableService's site
       * @type {Model}
       */
      site: {
        model: 'site'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();

