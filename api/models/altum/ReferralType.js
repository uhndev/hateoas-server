/**
 * ReferralType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./baseModel.js');
module.exports = {

  attributes: {


    /**
     * name
     * @description referral type name
     * @type {model}
     */

    name: {
      type: 'string'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
};
})();

