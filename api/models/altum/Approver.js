/**
 * approver
 *
 * @class approver
 * @description Model representation of a approver
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/approver.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/approver.js
 */

(function () {

  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports = {

    schema: true,
    attributes: {
      /**
       * user
       * @description A approver's user reference
       * @type {model}
       */
      user: {
        model: 'user'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
  };
})();

