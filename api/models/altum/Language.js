/**
 * client
 *
 * @class client
 * @description Model representation of a client
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/client.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/client.js
 */

(function () {

  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports = {

    schema: true,
    attributes: {

      /**
       * name
       * @description A language's name
       * @type {String}
       */

      name: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  }
})();
