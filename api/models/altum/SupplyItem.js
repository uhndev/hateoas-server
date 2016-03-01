/**
 * Supply
 *
 * @class Supply
 * @description Model representation of a Supply item
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
       * @description A supply item's name
       * @type {String}
       */
      name: {
        type: 'string',
        generator: faker.commerce.product
      },

      /**
       * UPC
       * @description UPC for this supply item
       * @type {String}
       */
      UPC: {
        type: 'string',
        generator: function(state) {
          return _.random(100000000000, 999999999999)
        }
      },

      /**
       * cost
       * @description A program supply item's billing max cost for a service
       * @type {Number}
       */
      cost: {
        type: 'integer',
        generator: faker.commerce.price
      },

      /**
       * supplyCategory
       * @description Denoted categorization for this supply item
       * @type {Model}
       */
      supplyCategory: {
        model: 'supplycategory'
      },

      /**
       * programSupplyItems
       * @description Collection of program supply items this supply refers to
       * @type {Collection}
       */
      programSupplyItems: {
        collection: 'programsupplyitem',
        via: 'supplyItems'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

