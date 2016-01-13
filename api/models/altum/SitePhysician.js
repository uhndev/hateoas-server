/**
 * SitePhysician.js
 *
 * @description a model representation of a physician at a site
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
       * site
       * @description The site where this physician is registered in
       * @type {Model}
       */
      site: {
        model: 'site'
      },

	    /**
       * physician
       * @description The physician registered at this site
       * @type {Model}
       */
      physician: {
        model: 'physician'
      },

	    /**
       * physicianSchedules
       * @description Collection of schedules for this physician at this site
       * @type {Collection}
       * @TODO: When scheduling becomes an issue, the relationship to handle it should probably go here.
       */
      //physicianSchedules: {
      //  collection: 'schedule',
      //  via: 'physician'
      //},

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  });
})();
