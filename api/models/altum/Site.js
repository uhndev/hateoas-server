/**
 * site
 *
 * @class site
 * @description Model representation of a site
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/site.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/site.js
 */

  (function () {

    var _super = require('./BaseModel.js');
    var _ = require('lodash');
    var HateoasService = require('../../services/HateoasService.js');

    _.merge(exports, _super);
    _.merge(exports, {

    schema:true,
    attributes: {


      /**
       * name
       * @description A site's name
       * @type {string}
       */

      name: {
        type: 'string'
      },


      /**
       * address
       * @description A site's address
       * @type {model}
       */

      address: {
        model: 'address'
      },


      /**
       * phone
       * @description a site's phone number
       * @type {integer}
       */

      phone: {
        type: 'string'
      },

      /**
       * altumServices
       * @description a collection of a site's offered services at altum
       * @type {collection}
       */

      altumServices: {
        collection: 'altumService',
        via: 'sites'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
    });
  })();


