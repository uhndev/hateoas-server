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
     * company
     * @description a payor's company
     * @type {String}
     */

    company: {
      model: 'company'
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

    programs : {
      collection: 'program',
      via: 'payors'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
  });
})();

