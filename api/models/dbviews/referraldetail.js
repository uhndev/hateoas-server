/**
 * A virtual model representing a database view.
 * See config/db/studyuser.sql for view definition.
 */
(function() {
  var UserModel = require('./../User.js');
  var _super = require('./baseView.js');

  _.merge(exports, _super);
  _.merge(exports, {

    migrate:'safe',
    attributes: {
      id: {
        type: 'integer'
      },
      client: {
        type: 'integer'
      },
      program: {
        type: 'integer'
      },
      physician: {
        type: 'integer'
      },
      status: {
        type: 'integer'
      },
      referralDate: {
        type: 'date'
      },
      client_firstName: {
        type: 'string'
      },
      client_lastName: {
        type: 'string'
      },
      client_mrn: {
        type: 'string'
      },
      client_prefix: {
        type: 'string'
      },
      client_gender: {
        type: 'string'
      },
      client_address1: {
        type: 'string'
      },
      client_address2: {
        type: 'string'
      },
      client_city: {
        type: 'string'
      },
      client_province: {
        type: 'string'
      },
      client_country: {
        type: 'string'
      },
      client_postalCode: {
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
      physician_name: {
        type: 'string'
      },
      toJSON: UserModel.attributes.toJSON

    }
  });

})();

