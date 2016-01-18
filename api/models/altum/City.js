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
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description A city's name, next to CityWok in ShiPaTown
       * @type {String}
       */
      name: {
        type: 'string',
        generator: faker.address.city
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();

