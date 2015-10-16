/**
 * referral.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


(function () {

  var _super = require('./BaseModel.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      /**
       * client
       * @description A referral's client
       * @type {model}
       */

      client: {
        model: 'client'
      },


      /**
       * claim
       * @description A referral's client
       * @type {model}
       */

      claim: {
        model: 'claim'
      },


      /**
       * program
       * @description A referral's program.
       * @type {model}
       */

      program: {
        model: 'program'
      },


      /**
       * physician
       * @description a referral's physician
       * @type {model}
       */

      physician: {
        model: 'physician'
      },


      /**
       * status
       * @description A referral's status
       * @type {string}
       */
      status: {
        type: 'string'
      },


      /**
       * referralDate
       * @description A referral's date
       * @type {date}
       */
      referralDate: {
        type: 'date'
      },


      /**
       * referralType
       * @description A referral's type
       * @type {string}
       */

      referralType: {
        model: 'referralType'
      },

      /**
       *
       * @description A referral's case
       * @type {string}
       */

      case: {
        model: 'case'
      },


      /**
       * accidentDate
       * @description A referral's accidentDate
       * @type {string}
       */

      accidentDate: {
        type: 'datetime'
      },


      /**
       * receiveDate
       * @description A referral's receiveDate
       * @type {string}
       */

      receiveDate: {
        type: 'datetime'
      },


      /**
       * sentDate
       * @description A referral's sentDate
       * @type {string}
       */

      sentDate: {
        type: 'datetime'
      },


      /**
       * dischargeDate
       * @description A referral's dischargeDate
       * @type {string}
       */

      dischargeDate: {
        type: 'datetime'
      },
      status: {
        model: 'status'
      },

      /**
       * clients
       * @description A referral's clients
       * @type {string}
       */

      clients: {
        collection: 'client',
        via: 'referrals'
      },

      /**
       * payors
       * @description A referral's payors
       * @type {string}
       */

      payors: {
        collection: 'payor',
        via: 'referrals'
      },


      /**
       * referralContacts
       * @description A referral's referralContacts
       * @type {string}
       */

      referralContacts: {
        collection: 'referralContact',
        via: 'referral'
      }

    }

  });

})();
