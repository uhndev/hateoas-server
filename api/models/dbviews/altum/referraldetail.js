/**
 * A virtual model representing a database view.
 * See config/db/altum/referraldetail.sql for view definition.
 */

(function () {
  var _ = require('lodash');
  var ReferralModel = require('./../../altum/Referral.js');
  var _super = require('./altumBaseView.js');

  var getResponseLinks = function (id, name) {
    return [
      {
        'rel': 'name',
        'prompt': 'Referral for ' + name,
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'referral', id
        ].join('/')
      },
      {
        'rel': sails.models.referraldetail.identity,
        'prompt': 'APP.HEADER.SUBMENU.OVERVIEW',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'referral', id
        ].join('/')
      },
      {
        'rel': sails.models.referral.identity,
        'prompt': 'APP.HEADER.SUBMENU.TRIAGE',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'referral',id, 'triage'
        ].join('/')
      },
      {
        'rel': sails.models.altumprogramservices.identity,
        'prompt': 'APP.HEADER.SUBMENU.RECOMMENDATIONS',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'referral', id, 'recommendations'
        ].join('/')
      },
      {
        'rel': sails.models.service.identity,
        'prompt': 'APP.HEADER.SUBMENU.SERVICES',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'referral', id, 'services'
        ].join('/')
      },
      {
        'rel': sails.models.invoice.identity,
        'prompt': 'APP.HEADER.SUBMENU.BILLING',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'referral', id, 'billing'
        ].join('/')
      }
    ];
  };

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      displayName: {
        type: 'string'
      },
      program: {
        model: 'program'
      },
      program_name: {
        type: 'string'
      },
      physician: {
        model: 'physician'
      },
      physician_name: {
        type: 'string'
      },
      staff: {
        model: 'staff'
      },
      staffType_name: {
        type: 'string'
      },
      staff_name: {
        type: 'string'
      },
      site: {
        model: 'site'
      },
      site_name: {
        type: 'string'
      },
      status: {
        model: 'status'
      },
      statusName: {
        type: 'string'
      },
      payor: {
        model: 'payor'
      },
      payor_displayName: {
        type: 'string'
      },
      referralDate: {
        type: 'date'
      },
      clinicDate: {
        type: 'date'
      },
      accidentDate: {
        type: 'datetime'
      },
      receiveDate: {
        type: 'datetime'
      },
      sentDate: {
        type: 'datetime'
      },
      dischargeDate: {
        type: 'datetime'
      },
      recommendationsMade: {
        type: 'boolean'
      },
      client: {
        model: 'client'
      },
      client_mrn: {
        type: 'string'
      },
      client_displayName: {
        type: 'string'
      },
      client_firstName: {
        type: 'string'
      },
      client_lastName: {
        type: 'string'
      },
      client_prefix: {
        type: 'string'
      },
      client_gender: {
        type: 'string'
      },
      client_dateOfBirth: {
        type: 'date'
      },
      client_address: {
        model: 'address'
      },
      client_address1: {
        type: 'string'
      },
      client_address2: {
        type: 'string'
      },
      client_city: {
        model: 'city'
      },
      client_cityName: {
        type: 'string'
      },
      client_province: {
        type: 'string'
      },
      client_postalCode: {
        type: 'string'
      },
      client_country: {
        type: 'string'
      },
      client_latitude: {
        type: 'string'
      },
      client_longitude: {
        type: 'string'
      },
      client_homePhone: {
        type: 'string'
      },
      client_daytimePhone: {
        type: 'string'
      },
      client_familyDoctor: {
        type: 'integer'
      },
      client_language: {
        type: 'integer'
      },
      client_interpreter: {
        type: 'boolean'
      },
      claimNumber: {
        type: 'string'
      },
      policyNumber: {
        type: 'string'
      },
      referralComments: {
        type: 'string'
      },
      getResponseLinks: function () {
        return getResponseLinks(this.id, this.displayName);
      },
      toJSON: ReferralModel.attributes.toJSON
    },

    getResponseLinks: getResponseLinks,

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
