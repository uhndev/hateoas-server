/**
 * claim
 *
 * @class claim
 * @description Model representation of a claim
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/claim.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/claim.js
 */

(function () {

  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports = {

    schema: true,
    attributes: {

      /**
       * claimNum
       * @description A claim's external number
       * @type {integer}
       */

      claimNum: {
        type: 'string'
      },


      /**
       * program
       * @description A claim's program
       * @type {model}
       */

      program: {
        model: 'program'
      },


      /**
       * referralDate
       * @description A claim's referral date.
       * @type {datea}
       */
      referralDate: {
        type: 'date'
      },


      /**
       * payor
       * @description a claim's payor
       * @type {string}
       */

      payor: {
        type: 'string'
      },


      /**
       * policyNum
       * @description a claim's external policyNum
       * @type {integer}
       */

      policyNum: {
        type: 'string'
      },


      /**
       * referralSource
       * @description A claim's referral Source
       * @type {string}
       */

      referralSource: {
        type: 'string'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  }
})();

