/**
 * city
 *
 * @class city
 * @description Model representation of a city
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/city.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/city.js
 */

(function () {

  var _super = require('./baseModel.js');
  var _ = require('lodash');

  module.exports = {

    schema: true,
    attributes: {

      /**
       * cityName
       * @description A city's name
       * @type {Date}
       */

      cityName: {
        type: 'string'
      },


      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
  };
})();
