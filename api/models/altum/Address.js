/**
 * address
 *
 * @class address
 * @description Model representation of an address
 */

(function () {

  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports = {
    schema:true,

    attributes: {

      /**
       * name
       * @description an address's name
       * @type {string}
       */
      name: {
        type: 'string'
      },

      /**
       * address1
       * @description an address's first line
       * @type {string}
       */

      address1: {
        type: 'string'
      },
      /**
       * address2
       * @description an address's second line
       * @type {string}
       */
      address2: {
        type: 'string'
      },

      /**
       * city
       * @description an address's city.
       * @type {stringj}
       */
      city: {
        type: 'string'
      },

      /**
       * province
       * @description An address's province
       * @type {stringj}
       */
      province: {
        type: 'string'
      },

      /**
       * postalCode
       * @description an address's postal code
       * @type {string}
       */
      postalCode: {
        type: 'string'
      },

      /**
       * country
       * @description an address's country
       * @type {string}
       */
      country: {
        type: 'string'
      },
      /**
       * region
       * @description A contact's region
       * @type {String}
       */

      region: {
        type: 'string'
      },

      /**
       * latitude
       * @description an address's latitude
       * @type {string}
       */
      latitude: {
        type: 'string'
      },

      /**
       * longitude
       * @description an address's longitude
       * @type {string}
       */
      longitude: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  }
})();

