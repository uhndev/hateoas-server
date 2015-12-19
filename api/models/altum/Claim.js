/**
 * claim
 *
 * @class claim
 * @description Model representation of a claim
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/claim.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/claim.js
 */

  (function () {

    var _super = require('../BaseModel.js');
    var _ = require('lodash');
    var HateoasService = require('../../services/HateoasService.js');

    _.merge(exports, _super);
    _.merge(exports, {

    schema: true,
    attributes: {

      /**
       * claimNum
       * @description A claim's external number
       * @type {integer}
       */

      claimNum: {
        type: 'string'
      },


      /**
       * payor
       * @description A claim's payor
       * @type {model}
       */

      payor: {
        model: 'payor'
      },


      /**
       * policyNum
       * @description a claim's external policyNum
       * @type {integer}
       */

      policyNum: {
        type: 'string'
      },


      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
    });
  })();

