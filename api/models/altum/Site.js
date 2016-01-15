/**
 * site
 *
 * @class site
 * @description Model representation of a site
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/site.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/site.js
 */

(function () {
  var _super = require('../BaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultPopulate: [ 'address', 'sitePhysicians' ],

    attributes: {

      /**
       * name
       * @description A site's name
       * @type {String}
       */
      name: {
        type: 'string',
        generator: function() {
          return _.sample([
            'Ajax',
            'Barrie',
            'Cambridge',
            'Hamilton Centennial',
            'Hamilton Queensdale',
            'Mississauga',
            'Ottawa',
            'Sudbury',
            'Toronto: Toronto Western Hospital',
            'Toronto: Outpatient Physiotherapy Department',
            'Vaughan'
          ]);
        }
      },

      /**
       * address
       * @description A site's address
       * @type {Model}
       */
      address: {
        model: 'address',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'address', Address);
        }
      },

      /**
       * phone
       * @description a site's phone number
       * @type {String}
       */
      phone: {
        type: 'string',
        generator: faker.phone.phoneNumber
      },

      /**
       * altumServices
       * @description a collection of a site's offered services at altum
       * @type {Collection}
       */
      altumServices: {
        collection: 'altumService',
        via: 'sites'
      },

      /**
       * sitePhysicians
       * @description Collection of physicians registered at this site
       * @type {Collection}
       */
      sitePhysicians: {
        collection: 'sitephysician',
        via: 'site'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();


