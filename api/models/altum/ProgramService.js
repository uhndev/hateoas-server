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

    defaultPopulate: ['AHServices'],

    // default fields to omit from template
    defaultTemplateOmit: ['createdAt', 'createdBy', 'updatedAt'],

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
        type: 'float'
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
       * statusForms
       * @description A programService's collection of forms per status
       * @type {Collection}
       */
      statusForms: {
        collection: 'statusform',
        via: 'programservice'
      },

      /**
       * payor
       * @description a programService's payor
       * @type {String}
       */
      payor: {
        model: 'payor'
      },

      /**
       * code
       * @description a programService's code
       * @type {String}
       */
      code: {
        type: 'string'
      },

      /**
       * repeatable
       * @description Boolean flag denoting whether this service can be repeated
       */
      repeatable: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * approvalNeeded
       * @description Boolean denoting whether this service needs approval or not by default
       */
      approvalNeeded: {
        type: 'boolean',
        defaultsTo: true
      },

      /**
       * approvalRequired
       * @description Boolean denoting whether this service requires approval or not by default and locked
       */
      approvalRequired: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * reportRequired
       * @description Boolean denoting whether this service needs a report or not
       */
      reportRequired: {
        type: 'boolean',
        defaultsTo: false
      },

      /**
       * payor
       * @description a programService's related program supply item, if one exists
       * @type {String}
       */
      programSupplyItem: {
        model: 'programSupplyItem'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return {
        name: '[TEST] CT SCAN',
        program: {
          name: '[TEST] WSIB Back and Neck Program'
        },
        price: _.random(100, 100000),
        code: 'scu1000',
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

    generateAndCreate: function (state) {
      var programService = this.generate();
      return Program.findOrCreate({name: programService.program.name}, programService.program)
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
          return ProgramService.findOrCreate({name: programService.name}, programService);
        })
        .then(function (programService) {
          sails.log.info("ProgramService: (" + programService.name + ") generated");
        });
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given programservice object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.program) {
        Program.findOne(values.program).exec(function (err, program) {
          if (err) {
            cb(err);
          } else {
            values.displayName = program.displayName + ' - ' + values.name;
            cb();
          }
        });
      } else {
        values.displayName = values.name;
        cb();
      }
    }

  });
})();

