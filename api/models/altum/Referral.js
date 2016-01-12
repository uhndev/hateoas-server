/**
 * referral.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


(function () {

  var _super = require('../BaseModel.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * client
       * @description A referral's client
       * @type {Model}
       */

      client: {
        model: 'client'
      },


      /**
       * claim
       * @description A referral's client
       * @type {Model}
       */

      claim: {
        model: 'claim'
      },


      /**
       * program
       * @description A referral's program.
       * @type {Model}
       */

      program: {
        model: 'program'
      },


      /**
       * physician
       * @description a referral's physician
       * @type {Model}
       */

      physician: {
        model: 'physician'
      },


      /**
       * status
       * @description A referral's status
       * @type {Model}
       */
      status: {
        model: 'status'
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
       *
       * @description A referral's case
       * @type {Model}
       */

      case: {
        model: 'case'
      },


      /**
       * accidentDate
       * @description A referral's accidentDate
       * @type {Datetime}
       */

      accidentDate: {
        type: 'datetime'
      },


      /**
       * receiveDate
       * @description A referral's receiveDate
       * @type {Datetime}
       */

      receiveDate: {
        type: 'datetime'
      },


      /**
       * sentDate
       * @description A referral's sentDate
       * @type {Datetime}
       */

      sentDate: {
        type: 'datetime'
      },

      /**
       * dischargeDate
       * @description A referral's dischargeDate
       * @type {Datetime}
       */

      dischargeDate: {
        type: 'datetime'
      },

      /**
       * recommendationsMade
       * @description A bool set when recommendations have been made
       * @type {boolean}
       */

      recommendationsMade: {
        type: 'boolean'
      },

      /**
       * services
       * @description A referral's services
       * @type {Collection}
       */

      services: {
        collection: 'service',
        via: 'referral'
      },

      /**
       * clients
       * @description A referral's clients
       * @type {Collection}
       */

      clients: {
        collection: 'client',
        via: 'referrals'
      },

      /**
       * payors
       * @description A referral's payors
       * @type {Collection}
       */

      payors: {
        collection: 'payor',
        via: 'referrals'
      },

      /**
       * referralContacts
       * @description A referral's referralContacts
       * @type {Collection}
       */

      referralContacts: {
        collection: 'person',
        via: 'referrals'
      }

    }

  });

})();
