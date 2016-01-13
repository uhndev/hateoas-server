/**
 *
 * @description a ClientContact's
 * @type {String}
 */

(function () {
  var ClientModel = require('./../altum/Client.js');
  var _super = require('./baseView.js');

  var getResponseLinks = function (id, name) {
    return [
      {
        'rel': 'name',
        'prompt': name,
        'name': 'name',
        'href': [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'client', id
        ].join('/')
      },
      {
        'rel': sails.models.client.identity,
        'prompt': 'APP.HEADER.SUBMENU.OVERVIEW',
        'name': 'name',
        'href': [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'client', id
        ].join('/')
      },
      {
        'rel': sails.models.referral.identity,
        'prompt': 'Referrals',
        'name': 'name',
        'href': [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'client', id, 'referrals'
        ].join('/')
      }
    ];
  };

  _.merge(exports, _super);
  _.merge(exports, {
    // displayFields: [ 'prefix', 'firstname', 'lastname' ],
    attributes: {

      /**
       * MRN
       * @description a ClientContact's MRN
       * @type {String}
       */
      MRN: {
        type: 'string',
        index: true
      },

      /**
       * language
       * @description a ClientContact's language
       * @type {String}
       */
      language: {
        type: 'string'
      },

      /**
       * Salutation
       * @description a ClientContact's Salutation
       * @type {String}
       */
      salutation: {
        type: 'integer'
      },

      /**
       * FirstName
       * @description a ClientContact's FirstName
       * @type {String}
       */
      firstName: {
        type: 'string'
      },

      /**
       * MiddleName
       * @description a ClientContact's MiddleName
       * @type {String}
       */
      middleName: {
        type: 'string'
      },

      /**
       * LastName
       * @description a ClientContact's LastName
       * @type {String}
       */
      lastName: {
        type: 'string'
      },

      /**
       * Gender
       * @description a ClientContact's Gender
       * @type {String}
       */
      gender: {
        type: 'string'
      },

      /**
       * BirthDate
       * @description a ClientContact's BirthDate
       * @type {String}
       */
      dateOfBirth: {
        type: 'dateTime'
      },

      /**
       * address1
       * @description a ClientContact's address1
       * @type {String}
       */
      address1: {
        type: 'string'
      },

      /**
       * address2
       * @description a ClientContact's address2
       * @type {String}
       */
      address2: {
        type: 'string'
      },

      /**
       * City
       * @description a ClientContact's City
       * @type {String}
       */
      city: {
        type: 'string'
      },

      /**
       * Province
       * @description a ClientContact's Province
       * @type {String}
       */
      province: {
        type: 'string'
      },

      /**
       * PostalCode
       * @description a ClientContact's PostalCode
       * @type {String}
       */
      postalCode: {
        type: 'string'
      },

      /**
       * Region
       * @description a ClientContact's Region
       * @type {String}
       */
      region: {
        type: 'string'
      },

      /**
       * Country
       * @description a ClientContact's Country
       * @type {String}
       */
      country: {
        type: 'string'
      },

      /**
       * Company
       * @description a ClientContact's Company
       * @type {String}
       */
      company: {
        type: 'string'
      },

      /**
       * HomePhone
       * @description a ClientContact's HomePhone
       * @type {String}
       */
      homePhone: {
        type: 'string'
      },

      /**
       * WorkPhone
       * @description a ClientContact's WorkPhone
       * @type {String}
       */
      workPhone: {
        type: 'string'
      },

      /**
       * Fax
       * @description a ClientContact's Fax
       * @type {String}
       */
      fax: {
        type: 'string'
      },

      /**
       * OtherPhone
       * @description a ClientContact's OtherPhone
       * @type {String}
       */
      otherPhone: {type: 'string'},

      /**
       * HomeEmail
       * @description a ClientContact's HomeEmail
       * @type {String}
       */
      homeEmail: {
        type: 'string'
      },

      /**
       * WorkEmail
       * @description a ClientContact's WorkEmail
       * @type {String}
       */
      workEmail: {
        type: 'string'
      },

      /**
       * displayName
       * @description a ClientContact's displayName
       * @type {String}
       */
      displayName: {
        type: 'string'
      },

      getResponseLinks: function () {
        return getResponseLinks(this.id, this.displayName);
      },

      toJSON: ClientModel.attributes.toJSON
    },

    getResponseLinks: getResponseLinks

  });
})();
