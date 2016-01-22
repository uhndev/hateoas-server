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
  var Promise = require('bluebird');
  var HateoasService = require('../../services/HateoasService.js');
  var siteFixtures = require('../../../test/fixtures/site.json');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultPopulate: [ 'address', 'siteStaff' ],

    attributes: {

      /**
       * name
       * @description A site's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      /**
       * address
       * @description A site's address
       * @type {Model}
       */
      address: {
        model: 'address'
      },

      /**
       * phone
       * @description a site's phone number
       * @type {String}
       */
      phone: {
        type: 'string'
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
       * siteStaff
       * @description Collection of physicians or clinicians registered at this site
       * @type {Collection}
       */
      siteStaff: {
        collection: 'sitestaff',
        via: 'site'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    generate: function (state) {
      return siteFixtures;
    },

    generateAndCreate: function (state) {
      return Promise.all(
        _.map(siteFixtures, function (site) {
          return Site.findOrCreate({ name: site.name }, site);
        })
      ).then(function (sites) {
        sails.log.info(sites.length + " site(s) generated");
      });
    }

  });
})();


