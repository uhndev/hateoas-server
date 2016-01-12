/**
 * company
 *
 * @class company
 * @description Model representation of a company
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/company.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/company.js
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
       * @description A company's name
       * @type {Date}
       */

      name: {
        type: 'string'
      },

      /**
       * phone
       * @description A company's phone
       * @type {Date}
       */

      phone: {
        type: 'string'
      },

      /**
       * address
       * @description A company's addresses
       * @type {model}
       */

      address: {
        model: 'address'
      },

      /**
       * faxl
       * @description A company's fax number
       * @type {string}
       */

      fax: {
        type: 'string'
      },

      /**
       * email
       * @description A company's email
       * @type {string}
       */

      email: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

