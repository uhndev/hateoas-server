/**
 * city
 *
 * @class city
 * @description Model representation of a city
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/city.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/city.js
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * cityName
       * @description A city's name, next to CityWok in ShiPaTown
       * @type {Date}
       */
      cityName: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();

