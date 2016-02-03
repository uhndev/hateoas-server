/**
 * ProgramService
 *
 * @class ProgramService
 * @description A model representation of an program service.  An example of this would be CT SCAN
 *              which would link to both a specific program (i.e. Head and Neck) and Altum Services
 *              (i.e. CT SCAN - HEAD).  A program service essentially serves as the link between the billing side
 *              of the application via payors and the assessment/recommendations side via program and altumService.
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
       * name
       * @description a programService's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * program
       * @description a programService's program (at altum), only for driving dropdowns
       * @type {String}
       */
      program: {
        model: 'program'
      },

      /**
       * price
       * @description a programService's billing max price for a service
       * @type {Integer}
       */
      price: {
        type: 'integer'
      },

      /**
       * AHServices
       * @description an AvailableService's AHServices
       * @type {Collection}
       */
      AHServices: {
        collection: 'altumservice',
        via: 'programServices',
        dominant: true
      },

      /**
       * payor
       * @description a programService's payor
       * @type {String}
       */
      payor: {
        model: 'payor'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function(state) {
      return {
        name: '[TEST] CT SCAN',
        program: {
          name: '[TEST] WSIB Back and Neck Program'
        },
        price: _.random(100, 100000),
        AHServices: [
          {
            name: '[TEST] CT SCAN - HEAD',
            program: null,
            serviceCategory: null
          },
          {
            name: '[TEST] CT SCAN - NECK',
            program: null,
            serviceCategory: null
          },
          {
            name: '[TEST] CT SCAN - BACK',
            program: null,
            serviceCategory: null
          }
        ]
      }
    },

    generateAndCreate: function(state) {
      var programService = this.generate();
      return Program.findOrCreate({ name: programService.program.name }, programService.program)
        .then(function (program) {
          // set newly created program ID
          delete programService.program;
          programService.program = program.id;

          // apply program IDs to altumServices
          programService.AHServices = _.map(programService.AHServices, function (altumService) {
            altumService.program = program.id;
            return altumService;
          });
          return ServiceCategory.findOneByName('Diagnosis');
        })
        .then(function (serviceCategory) {
          // apply serviceCategory IDs to altumServices
          programService.AHServices = _.map(programService.AHServices, function (altumService) {
            altumService.serviceCategory = serviceCategory.id;
            return altumService;
          });
          return ProgramService.findOrCreate({ name: programService.name }, programService);
        })
        .then(function (programService) {
          sails.log.info("ProgramService: (" + programService.name + ") generated");
        });
    }

  });
})();

