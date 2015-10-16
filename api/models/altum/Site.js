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
       * siteName
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
       * role
       * @description role of this relationship
       * @type {model}
       */

      role: {
        model: 'contactRole'
      },


      /**
       * phone
       * @description a site's phone number
       * @type {integer}
       */

      phone: {
        type: 'string'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
    });
  })();


