/**
 * program
 *
 * @class program
 * @description Model representation of a program
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/program.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/program.js
 */

(function () {

  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports = {

    schema: true,
    attributes: {

      /**
       * programName
       * @description A program's name
       * @type {Date}
       */
      programName: {
        type: 'string'
      },

      /**
       * programCode
       * @description A program's code
       * @type {string}
       */
      programCode: {
        type: 'string'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  };
})();
