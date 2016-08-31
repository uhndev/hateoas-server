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
       * comments
       * @description Simple text field for capturing invoice related comments
       * @type {String}
       */
      comments: {
        type: 'string'
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

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
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
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this user's expiredAt attribute, this function
     *              will check and invalidate any active InvoiceServices.
     *
     * @param  {Object}   updated updated invoice object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function(updated, cb) {
      switch (true) {
        case !_.isNull(updated.expiredAt):
          return InvoiceService.update({ invoice: updated.id }, { expiredAt: new Date() })
            .then(function (invoiceServices) {
              cb();
            }).catch(cb);
          break;
        case updated.status === 'Voided':
          return InvoiceService.find({invoice: updated.id})
            .then(function (invoiceServices) {
              return [
                Service.find({id: _.map(invoiceServices, 'service')}),
                Status.findOne({systemName: 'SUSPENDED'})
              ];
            })
            .spread(function (services, suspendedStatus) {
              return Promise.all(_.map(services, function (service) {
                return BillingStatus.create({
                  status: suspendedStatus.id,
                  service: service.id,
                  createdBy: 1,
                  owner: 1
                });
              }));
            })
            .then(function (servicePromises) {
              cb();
            }).catch(cb);
        default: 
          return cb();
      }
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
          return Invoice.find(query).populate(['referral', 'payor']).where({referral: referralID, expiredAt: null});
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

