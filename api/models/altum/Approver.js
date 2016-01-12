/**
 * approver
 *
 * @class approver
 * @description Model representation of a approver
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/approver.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/approver.js
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {
      /**
       * user
       * @description A approver's user reference
       * @type {Model}
       */
      user: {
        model: 'user'
      },

      /**
       * title
       * @description A approver's title
       * @type {String}
       */
      title: {
        type: 'string'
      },
      /**
       * name
       * @description A approver's name
       * @type {String}
       */
      name: {
        type: 'string'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

