/**
 * SiteService
 *
 * @description A model of Site Services, used for populating/organizing services on the altum side during daily operations
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * service
       * @description an SiteService's service
       * @type {Model}
       */
      service: {
        model: 'service'
      },

      /**
       * site
       * @description an Service's site
       * @type {Model}
       */
      site: {
        model: 'site'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();

