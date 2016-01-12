/**
 * ReferralContact.js
 *
 * @description :: manual relationship table between referrals and contacts
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * referral
       * @description referral key from referral table side of relationship
       * @type {Model}
       */

      referral: {
        model: 'referral'
      },


      /**
       * contact
       * @description person from person side of the relationship
       * @type {Model}
       */

      person: {
        model: 'person'
      },


      /**
       * role
       * @description role of this relationship
       * @type {Model}
       */

      role: {
        model: 'contactRole'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

