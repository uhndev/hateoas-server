/**
 * Referral.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
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
        model: 'claim'
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
       * @description a referral's physician
       * @type {Model}
       */
      physician: {
        model: 'physician',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'physician', Physician);
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
