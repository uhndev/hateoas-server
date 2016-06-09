/**
 * Payor
 *
 * @class Payor
 * @description Model representation of a Payor
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var faker = require('faker');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    defaultPopulate: [ 'company', 'statusForms' ],

    attributes: {

      /**
       * name
       * @description a payor's name
       * @type {String}
       */
      name: {
        type: 'string',
        generator: faker.company.companyName
      },

      /**
       * company
       * @description a payor's company
       * @type {String}
       */
      company: {
        model: 'company',
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'company', Company);
        }
      },

      /**
       * referrals
       * @description a payor's referrals
       * @type {String}
       */
      referrals: {
        collection: 'referral',
        via: 'payors'
      },

      /**
       * programs
       * @description a payor's programs
       * @type {String}
       */
      programs: {
        collection: 'program',
        via: 'payor'
      },

      /**
       * statusForms
       * @description A payor's collection of forms per status
       * @type {Collection}
       */
      statusForms: {
        collection: 'statusform',
        via: 'payor'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

