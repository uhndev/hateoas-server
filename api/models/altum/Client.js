/**
 * Client
 *
 * @class Client
 * @description Model representation of a Client
 */

  (function () {

    var _super = require('./BaseModel.js');
    var _ = require('lodash');
    var HateoasService = require('../../services/HateoasService.js');

    _.merge(exports, _super);
    _.merge(exports, {
    attributes: {

      /**
       * person
       * @description A client's person record
       * @type {model}
       */
      person: {
        model: 'person'
      },

      /**
       * MRN
       * @description A client's mrn
       * @type {string}
       */
      MRN: {
        type: 'string',
        index: true
      },

      /**
       * familyDoctor
       * @description A client's familyDoctor
       * @type {integer}
       */
      familyDoctor: {
        model: 'physician'
      },

      /**
       * referrals
       * @description A client's referrals
       * @type {integer}
       */
      referrals: {
        collection: 'referral',
        via: 'clients'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
    });
  })();

