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
       * cost
       * @description A program supply item's billing max cost for a service
       * @type {Number}
       */
      cost: {
        type: 'float',
        generator: faker.commerce.price
      },

      /**
       * supplyItems
       * @description Collection of supply items for this program supply item
       * @type {Collection}
       */
      supplyItems: {
        collection: 'supplyitem',
        via: 'programSupplyItems'
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

