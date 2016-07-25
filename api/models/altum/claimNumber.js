/**
 * ClaimNumber
 *
 * @class ClaimNumber
 * @description Model representation of a claim number, which links with referral and payors
 */

(function () {
  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var faker = require('faker');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {


    attributes:{
    /**
     * number
     * @description A referral's claim number
     * @type {string}
     */
    number: {
      type: 'string',
      generator: function(state) {
        return [_.random(100000, 999999), faker.address.countryCode(), faker.address.countryCode()].join('-');
      }
    },
    /**
     * payor
     * @description A payor for the claim number
     * @type {model}
     */
    payor: {
      model:'payor'
    },

    /**
     * referral
     * @description the referrals for a claim number
     * @type {string}
     */
    referrals: {
      collection:'referral',
      via:'claimNumber'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }

  });
})();
