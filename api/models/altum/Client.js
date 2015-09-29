/**
 * client
 *
 * @class client
 * @description Model representation of a client
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/client.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/Client.js
 */


(function () {

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

      emergencyContacts: {
        model: 'emergencyContact',
        via: 'client'
      },

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


