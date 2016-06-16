/**
 * ProgramSupplyItem
 *
 * @class ProgramSupplyItem
 * @description Model representation of a Program Supply Item
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var faker = require('faker');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description A program supply item's name
       * @type {String}
       */
      name: {
        type: 'string',
        generator: faker.commerce.product
      },

      /**
       * program
       * @description Reference to the program for this supply item
       * @type {Model}
       */
      program: {
        model: 'program',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'program', Program);
        }
      },

      /**
       * code
       * @description A program supply item's code
       * @type {String}
       */
      code: {
        type: 'string',
        generator: function() {
          return [faker.address.countryCode(), _.random(100, 999)].join('-');
        }
      },


      /**
       * payorPrice
       * @description price of programSupplyItem
       * @type {float}
       */
      payorPrice: {
        type: 'float',
        defaultsTo: null
      },

      /**
       * overrideSubtotal
       * @description overridden subtotal if set of programSupplyItem
       * @type {float}
       */
      overriddenSsubtotal: {
        type: 'float',
        defaultsTo: null
      },
      /**
       * overriddenTax
       * @description overridden tax if set of programSupplyItem
       * @type {float}
       */
      overrideTax: {
        type: 'float',
        defaultsTo: null
      },

      /**
       * supplyItem
       * @description Collection of supply items for this program supply item
       * @type {model}
       */
      supplyItem: {
        model: 'supplyItem'
      },

      /**
       * services
       * @description Collection of services this supply refers to
       * @type {Collection}
       */
      services: {
        collection: 'service',
        via: 'programSupplyItems'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

