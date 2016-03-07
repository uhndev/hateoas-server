/**
 * SupplyCategory
 *
 * @description A model representation of a supplyCategory
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
       * @description A supply category's name
       * @type {String}
       */
      name: {
        type: 'string',
        unique: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return [
        { name: 'Self-Care' },
        { name: 'Electronic' },
        { name: 'Diagnostic' },
        { name: 'Surgical' },
        { name: 'Durable Medical Equipment' },
        { name: 'Acute Care' },
        { name: 'Emergency and Trauma' },
        { name: 'Long-Term Care' },
        { name: 'Storage and Transport' }
      ];
    },

    generateAndCreate: function (state) {
      var categories = this.generate();
      return Promise.all(
        _.map(categories, function (category) {
          return SupplyCategory.findOrCreate({ name: category.name }, category);
        })
      ).then(function (categories) {
        sails.log.info(categories.length + " supplyCategory(s) generated");
      });
    }

  });
})();
