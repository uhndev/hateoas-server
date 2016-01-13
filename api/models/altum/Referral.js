/**
 * referral.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


(function () {

  var _super = require('../BaseModel.js');
  var HateoasService = require('../../services/HateoasService.js');

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
       * @type {string}
       */

      services: {
        collection: 'service',
        via: 'referral'
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
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },
    findByBaseModel: function(clientID, currUser, options) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;
      return clientcontact.findOne(clientID).then(function (client) {
            this.links = client.getResponseLinks();
            return Referral.find(query).where({ client: clientID });
          })
          .then(function (referrals) {
            return {
              data: referrals,
              links: this.links
            };
          });
    },

  });

})();
