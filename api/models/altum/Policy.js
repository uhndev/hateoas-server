/**
 * Policy
 *
 * @class Policy
 * @description Model representation of OHIP and related policy number
 */

(function () {

  var _super = require('./AltumBaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {
    attributes:{

      //ohipNumber
      number:{
        type:'string'
      },
      /**
       * client
       * @description A client which the policy number belongs to
       * @type {Model}
       */
      client: {
        model: 'client'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  });
})();
