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
     * claimNumber
     * @description A referral's claim number
     * @type {string}
     */
    claimNumber: {
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
     * referrals
     * @description the referrals for a claim number
     * @type {collection}
     */
    referrals: {
      collection:'referral',
      via:'claim'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }

  });
})();
