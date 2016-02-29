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
    }

  });
})();
