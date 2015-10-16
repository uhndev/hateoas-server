/**
 * client
 *
 * @class client
 * @description Model representation of a client
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/client.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/client.js
 */

(function () {

  var _super = require('./baseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports = {

    schema: true,
    attributes: {

      /**
       * caseNumber
       * @description A case's number
       * @type {integer}
       */

      caseNumber: {
        type: 'integer'
      },

      /**
       * caseContact
       * @description A case's contact
       * @type {model}
       */

      contact: {
        model: 'contact'
      },


      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  }
})();
