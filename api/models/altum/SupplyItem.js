/**
 * Supply
 *
 * @class Supply
 * @description Model representation of a Supply item
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
       * @description A supply item's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * UPC
       * @description UPC for this supply item
       * @type {String}
       */
      UPC: {
        type: 'string'
      },

      /**
       * cost
       * @description A program supply item's billing max cost for a service
       * @type {Number}
       */
      cost: {
        type: 'integer'
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

