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
       * supplyCategory
       * @description Denoted categorization for this supply item
       * @type {Model}
       */
      supplyCategory: {
        model: 'supplycategory'
      },

      /**
       * cost
       * @description a service's cost
       * @type {float}
       */
      cost: {
        type: 'float',
        defaultsTo: null
      },

      /**
       * costShipping
       * @description service's shippingCost
       * @type {float}
       */
      costShipping: {
        type: 'float',
        defaultsTo: null
      },

      /**
       * costSubtotal
       * @description a service's sub-total
       * @type {float}
       */
      costSubtotal: {
        type: 'float',
        defaultsTo: null
      },

      /**
       * costTax
       * @description
       * @type {float} a service's taxes
       */
      costTax: {
        type: 'float',
        defaultsTo: null
      },

      /**
       * costTotal
       * @description
       * @type {float} a service's total
       */
      costTotal : {
        type: 'float',
        defaultsTo: null
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

      /**
       * supplier
       * @description A program supply item's supplier
       * @type {string}
       */
      supplier: {
        type: 'string',
        generator: faker.commerce.company
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();
