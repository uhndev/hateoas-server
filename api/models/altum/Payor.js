/**
 * Payor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

  attributes: {

    /**
     * contact
     * @description a payor's contact
     * @type {String}
     */

    contact: {
      model: 'contact'
    },

    /**
     * referrals
     * @description a payor's referrals
     * @type {String}
     */

    referrals: {
      collection: 'referral',
      via: 'payors',
      dominant:true
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
  });
})();

