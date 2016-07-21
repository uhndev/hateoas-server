/**
 * Referral
 *
 * @class Referral
 * @description Model representation of a Referral, which denotes the initial referral for a physician/site/client
 *              selection.  After a referral is made, recommendations for medical services can be made for the client.
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
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
       * claimNumber
       * @description A referral's claimNumber
       * @type {string}
       */
      claimNumber: {
        type: 'string',
        generator: function(state) {
          return [_.random(100000, 999999), faker.address.countryCode(), faker.address.countryCode()].join('-');
        }
      },

      /**
       * policy
       * @description A referral's policy
       * @type {Model}
       */
      policy: {
        model: 'policy'
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
       * @description Reference to the primary provider physician - will be set if primaryProviderType was
       *              set to null in the related Program
       * @type {Model}
       */
      physician: {
        model: 'physician',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'physician', Physician);
        }
      },

      /**
       * staff
       * @description Reference to the primary provider - will be set if primaryProviderType
       *              was set as a particular StaffType in the related Program
       * @type {Model}
       */
      staff: {
        model: 'staff'
      },

      /**
       * isPhysicianPrimary
       * @description Boolean denoting which of physician or staff on this record is the primary provider.
       * @type {Boolean}
       */
      isPhysicianPrimary: {
        type: 'boolean',
        defaultsTo: true
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
       * externalID
       * @description A referral's external ID (usually )
       * @type {String}
       */
      externalID: {
        type: 'string'
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
       * referralComments
       * @description Comments for a specific referral
       * @type {string}
       */
       referralComments: {
         type: 'string'
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
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given referral object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      if (values.client) {
        Client.findOne(values.client).exec(function (err, client) {
          if (err) {
            cb(err);
          } else {
            values.displayName = client.displayName;
            cb();
          }
        });
      } else {
        cb();
      }
    }

  });

})();
