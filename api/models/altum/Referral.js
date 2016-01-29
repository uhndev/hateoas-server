/**
 * Referral
 *
 * @class Referral
 * @description Model representation of a Referral, which denotes the initial referral for a physician/site/client
 *              selection.  After a referral is made, recommendations for medical services can be made for the client.
 */

(function () {
  var _super = require('../BaseModel.js');
  var faker = require('faker');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultPopulate: [ 'payors' ],

    attributes: {

      /**
       * client
       * @description A referral's client
       * @type {Model}
       */
      client: {
        model: 'client',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'client', Client);
        }
      },

      /**
       * claim
       * @description A referral's client
       * @type {Model}
       */
      claim: {
        model: 'claim',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'claim', Claim);
        }
      },

      /**
       * site
       * @description A referral's site
       * @type {Model}
       */
      site: {
        model: 'site'
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
       * @description The physician registered at this site
       * @type {Model}
       */
      physician: {
        model: 'physician',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'physician', Physician);
        }
      },

      /**
       * clinician
       * @description The clinician registered at this site
       * @type {Model}
       */
      clinician: {
        model: 'clinician',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'clinician', Clinician);
        }
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
        type: 'date',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * clinicDate
       * @description A referral's clinic date
       * @type {date}
       */
      clinicDate: {
        type: 'date',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * accidentDate
       * @description A referral's accidentDate
       * @type {Datetime}
       */
      accidentDate: {
        type: 'datetime',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * receiveDate
       * @description A referral's receiveDate
       * @type {Datetime}
       */
      receiveDate: {
        type: 'datetime',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * sentDate
       * @description A referral's sentDate
       * @type {Datetime}
       */
      sentDate: {
        type: 'datetime',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * dischargeDate
       * @description A referral's dischargeDate
       * @type {Datetime}
       */
      dischargeDate: {
        type: 'datetime',
        generator: function() {
          return faker.date.past();
        }
      },

      /**
       * recommendationsMade
       * @description A bool set when recommendations have been made
       * @type {boolean}
       */
      recommendationsMade: {
        type: 'boolean',
        defaultsTo: false
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
       * notes
       * @description Collection of referral notes
       * @type {Collection}
       */
      notes: {
        collection: 'note',
        via: 'referral'
      },

      /**
       * referralContact
       * @description A referral's referralContact
       * @type {Model}
       */
      referralContact: {
        model: 'employee',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'referralContact', Employee);
        }
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    findByBaseModel: function (clientID, currUser, options) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;
      return clientcontact.findOne(clientID).then(function (client) {
          this.links = client.getResponseLinks();
          return referraldetail.find(query).where({client: clientID});
        })
        .then(function (referrals) {
          return {
            data: referrals,
            links: this.links
          };
        });
    }

  });

})();
