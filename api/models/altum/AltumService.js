/**
 * AltumService
 *
 * @class altumservice
 * @description A model of AltumServices, used for populating/organizing services on the altum side during daily operations
 *              and represents the available services that Altum provides.  Further specification is done in ProgramService
 *              where an example of an Altum Service can be CT SCAN, then a sample Program Service would be CT SCAN - HEAD.
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultPopulate: [ 'programServices', 'serviceCategory' ],

    attributes: {

      /**
       * name
       * @description an AltumService's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * program
       * @description a altumService's program (at altum), only for driving dropdowns
       * @type {Model}
       */
      program: {
        model: 'program'
      },

      /**
       * programServices
       * @description an AvailableService's programServices
       * @type {Collection}
       */
      programServices: {
        collection: 'programService',
        via: 'altumService'
      },

      /**
       * available
       * @description an AvailableService's availability
       * @type {Boolean}
       */
      available: {
        type: 'boolean'
      },

      /**
       * sites
       * @description a collection of a site's where the altumService is offered
       * @type {Collection}
       */
      sites: {
        collection: 'site',
        via: 'altumServices'
      },

      /**
       * serviceCategory
       * @description a ProgramService's mapping to it's serviceCategory
       * @type {Model}
       */
      serviceCategory: {
        model: 'servicecategory'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }

  });
})();

