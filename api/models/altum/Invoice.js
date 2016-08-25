/**
 * Invoice
 *
 * @description A model representation of an invoice
 * @docs        http://sailsjs.org/#!documentation/models
 */

(function () {
  var Promise = require('bluebird');
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * number
       * @description String denoting the Invoice number
       * @type {String}
       */
      number: {
        type: 'string',
        unique: true
      },

      /**
       * referral
       * @description Reference to the referral for which this invoice refers to
       * @type {Model}
       */
      referral: {
        model: 'referral'
      },

      /**
       * payor
       * @description an invoice's associated payor
       * @type {Model}
       */
      payor: {
        model: 'payor'
      },

      /**
       * invoiceServices
       * @description a collection of an invoices billed for services
       * @type {Collection}
       */
      invoiceServices: {
        collection: 'invoiceService',
        via: 'invoice'
      },

      /**
       * status
       * @description Status of Invoice stages - will be managed by an external process
       * @type {String}
       */
      status: {
        type: 'string',
        enum: ['Pending', 'Processing', 'Processed', 'Voided'],
        defaultsTo: 'Pending'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * beforeValidate
     * @description After validation/creation displayName is updated with values
     *              from fields listed in the defaultsTo attribute of displayName
     *              this can be overridden in child models inheriting from the
     *              basemodel to pick specific fields
     * @param  {Object}   values  given invoice object for creation
     * @param  {Function} cb      callback function on completion
     */
    beforeValidate: function (values, cb) {
      var promises = [];
      _.each(['payor', 'referral'], function (key) {
        if (values[key]) {
          promises.push(sails.models[key].findOne(_.has(values[key], 'id') ? values[key].id : values[key]));
        } else {
          promises.push(null);
        }
      });

      return Promise.all(promises).spread(function (payor, referral) {
        var invoiceName = _.map(_.filter([payor, referral]), 'displayName');
        values.displayName = [values.number].concat(invoiceName).join(' - ');
        cb();
      }).catch(cb);
    },

    /**
     * findByBaseModel
     * @description Endpoint for returning Invoices for a given Referral
     */
    findByBaseModel: function (referralID, currUser, options) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;
      return referraldetail.findOne(referralID).then(function (referral) {
          this.links = referral.getResponseLinks();
          return Invoice.find(query).populate(['referral', 'payor']).where({referral: referralID});
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

