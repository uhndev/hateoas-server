/**
 * Address
 *
 * @class Address
 * @description Model representation of an address
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    displayFields: [ 'address1', 'address2', 'province', 'country' ],

    attributes: {

      /**
       * address1
       * @description an address's first line
       * @type {String}
       */
      address1: {
        type: 'string',
        generator: faker.address.streetAddress
      },
      /**
       * address2
       * @description an address's second line
       * @type {String}
       */
      address2: {
        type: 'string',
        generator: faker.address.secondaryAddress
      },

      /**
       * city
       * @description an address's city.
       * @type {Model}
       */
      city: {
        model: 'city',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'city', City);
        }
      },

      /**
       * province
       * @description An address's province
       * @type {String}
       */
      province: {
        type: 'string',
        generator: faker.address.state
      },

      /**
       * postalCode
       * @description an address's postal code
       * @type {String}
       */
      postalCode: {
        type: 'string',
        generator: faker.address.zipCode
      },

      /**
       * country
       * @description an address's country
       * @type {String}
       */
      country: {
        type: 'string',
        generator: faker.address.country
      },

      /**
       * region
       * @description A address's region
       * @type {String}
       */
      region: {
        type: 'string',
        generator: faker.address.county
      },

      /**
       * latitude
       * @description an address's latitude
       * @type {String}
       */
      latitude: {
        type: 'string',
        generator: function (state) {
          var range = 44.145044;
          var baseLat = 43.653226;
          return (Math.random() * (range - baseLat) + baseLat).toFixed(5);
        }
      },

      /**
       * longitude
       * @description an address's longitude
       * @type {String}
       */
      longitude: {
        type: 'string',
        generator: function (state) {
          var range = -80.37509855;
          var baseLon = -79.38318429999998;
          return (Math.random() * (range - baseLon) + baseLon).toFixed(5);
        }
      },

      /**
       * person
       * @description an address's associated person
       * @type {Model}
       */
      person: {
        model: 'person',
        preventCreate: true
      },

      /**
       * company
       * @description an address's associated company
       * @type {Model}
       */
      company: {
        model: 'company',
        preventCreate: true,
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'company', Company);
        }
      },

      /**
       * site
       * @description an address's associated site
       * @type {Model}
       */
      site: {
        model: 'site',
        preventCreate: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  })
})();

