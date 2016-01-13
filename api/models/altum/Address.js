/**
 * address
 *
 * @class address
 * @description Model representation of an address
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * name
       * @description an address's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * address1
       * @description an address's first line
       * @type {String}
       */

      address1: {
        type: 'string'
      },
      /**
       * address2
       * @description an address's second line
       * @type {String}
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
        model: 'city'
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
       * @type {String}
       */
      postalCode: {
        type: 'string'
      },

      /**
       * country
       * @description an address's country
       * @type {String}
       */
      country: {
        type: 'string'
      },
      /**
       * region
       * @description A address's region
       * @type {String}
       */

      region: {
        type: 'string'
      },

      /**
       * latitude
       * @description an address's latitude
       * @type {String}
       */
      latitude: {
        type: 'string'
      },

      /**
       * longitude
       * @description an address's longitude
       * @type {String}
       */
      longitude: {
        type: 'string'
      },

      /**
       * person
       * @description an address's associated person
       * @type {Model}
       */

      person: {
        model: 'person'
      },

      /**
       * company
       * @description an address's associated company
       * @type {Model}
       */
      company: {
        model: 'company'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  })
})();

