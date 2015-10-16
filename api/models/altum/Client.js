/**
 * Client
 *
 * @class Client
 * @description Model representation of a Client
 */

(function () {

  var _super = require('./baseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  module.exports= {
    attributes: {

      /**
       * contact
       * @description A client's contact
       * @type {String}
       */
      contact: {
        model: 'contact'
      },

      /**
       * emergencyContacts
       * @description A client's emergencyContacts
       * @type {String}
       */
      /*emergencyContacts: {
        model: 'emergencyContact',
        via: 'client'
      },*/

      /**
       * MRN
       * @description A client's mrn
       * @type {string}
       */
      MRN: {
        type: 'string',
        index: true
      },

      /**
       * familyDoctor
       * @description A client's familyDoctor
       * @type {integer}
       */
      familyDoctor: {
        model: 'physician'
      },

      /**
       * referrals
       * @description A client's referrals
       * @type {integer}
       */
      referrals: {
        collection: 'referral',
        via: 'client'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)

    }
  }
})();


