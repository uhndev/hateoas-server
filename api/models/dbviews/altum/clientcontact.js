/**
 *
 * @description a ClientContact's
 * @type {String}
 */

(function () {
  var ClientModel = require('./../../altum/Client.js');
  var _super = require('./altumBaseView.js');

  var getResponseLinks = function (id, name) {
    return [
      {
        'rel': 'name',
        'prompt': name,
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'client', id
        ].join('/')
      },
      {
        'rel': sails.models.client.identity,
        'prompt': 'APP.HEADER.SUBMENU.OVERVIEW',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'client', id
        ].join('/')
      },
      {
        'rel': sails.models.referral.identity,
        'prompt': 'APP.HEADER.SUBMENU.REFERRALS',
        'name': 'name',
        'href': [
          sails.config.appUrl + sails.config.blueprints.prefix, 'client', id, 'referrals'
        ].join('/')
      }
    ];
  };

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      MRN: {
        type: 'string',
        index: true
      },
      displayName: {
        type: 'string'
      },
      firstName: {
        type: 'string'
      },
      middleName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      gender: {
        type: 'string'
      },
      dateOfBirth: {
        type: 'dateTime'
      },
      homePhone: {
        type: 'string'
      },

      fax: {
        type: 'string'
      },
      otherPhone: {
        type: 'string'
      },
      homeEmail: {
        type: 'string'
      },
      language: {
        type: 'string'
      },
      requiresInterpreter: {
        type: 'boolean'
      },
      address1: {
        type: 'string'
      },
      address2: {
        type: 'string'
      },
      city: {
        type: 'string'
      },
      province: {
        type: 'string'
      },
      postalCode: {
        type: 'string'
      },
      region: {
        type: 'string'
      },
      company: {
        model: 'company'
      },
      country: {
        type: 'string'
      },
      personid: {
        type: 'integer'
      },
      latitude: {
        type: 'string'
      },
      longitude: {
        type: 'string'
      },

      primaryEmergencyContact: {
        model: 'emergencyContact'
      },

      getResponseLinks: function () {
        return getResponseLinks(this.id, this.displayName);
      },

      toJSON: ClientModel.attributes.toJSON
    },

    getResponseLinks: getResponseLinks

  });
})();
