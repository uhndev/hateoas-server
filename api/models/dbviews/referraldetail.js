/**
 * A virtual model representing a database view.
 * See config/db/arm/referraldetail.sql for view definition.
 */

(function () {
  var ReferralModel = require('./../altum/Referral.js');
  var _super = require('./baseView.js');

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
      site: {
        model: 'site'
      },
      site_name: {
        type: 'string'
      },
      status: {
        model: 'status'
      },
      referralDate: {
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
      client_address1: {
        type: 'string'
      },
      client_address2: {
        type: 'string'
      },
      client_city: {
        model: 'city'
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
      client_workPhone: {
        type: 'string'
      },
      client_familyDoctor: {
        type: 'integer'
      },
      client_language: {
        type: 'integer'
      },
      claim_claimNum: {
        type: 'string'
      },
      claim_policyNum: {
        type: 'string'
      },
      toJSON: ReferralModel.attributes.toJSON
    }
  });
})();

