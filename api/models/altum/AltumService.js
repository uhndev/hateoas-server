/**
 * AltumService
 *
 * @class altumservice
 * @description A model of AltumServices, used for populating/organizing services on the altum side during daily operations
 *              and represents the available services that Altum provides.
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultPopulate: [ 'programServices', 'sites', 'staffTypes' ],

    attributes: {

      /**
       * name
       * @description an AltumService's name
       * @type {String}
       */
      name: {
        type: 'string',
        unique: true
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
        collection: 'programservice',
        via: 'AHServices'
      },

      /**
       * available
       * @description an AvailableService's availability
       * @type {Boolean}
       */
      available: {
        type: 'boolean',
        defaultsTo: true
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

      /**
       * staffTypes
       * @description Collection of staff types that can be associated with this AltumService
       * @type {Collection}
       */
      staffTypes: {
        collection: 'stafftype',
        via: 'altumServices'
      },

      /**
       * visitable
       * @description Boolean flag denoting whether
       */
      visitable: {
        type: 'boolean',
        defaultsTo: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }

  });
})();

