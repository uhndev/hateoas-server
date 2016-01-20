/**
 * claim
 *
 * @class claim
 * @description Model representation of a claim
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/claim.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/claim.js
 */

(function () {
  var _super = require('../BaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    displayFields: [ 'claimNum' ],

    attributes: {

      /**
       * claimNum
       * @description A claim's external number
       * @type {String}
       */
      claimNum: {
        type: 'string',
        generator: function(state) {
          return [_.random(100000, 999999), faker.address.countryCode(), faker.address.countryCode()].join('-');
        }
      },

      /**
       * payor
       * @description A claim's payor
       * @type {Model}
       */
      payor: {
        model: 'payor',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'payor', Payor);
        }
      },

      /**
       * policyNum
       * @description a claim's external policyNum
       * @type {String}
       */
      policyNum: {
        type: 'string',
        generator: function(state) {
          return [_.random(100000, 999999), faker.address.countryCode(), faker.address.countryCode()].join('-');
        }
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

