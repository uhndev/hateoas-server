/**
 * Employment.js
 *
 * @description :: a table representing the employment of persons in compnaies
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * company
       * @description the company this employment is at
       * @type {Model}
       */

      company: {
        model: 'company'
      },

      /**
       * person
       * @description the person who's employed
       * @type {Model}
       */

      person: {
        model: 'person'
      },

      /**
       * phoneNumber
       * @description the employed person's work number
       * @type {String}
       */

      phoneNumber: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();


