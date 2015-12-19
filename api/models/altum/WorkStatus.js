/**
 * WorkStatus
 *
 * @class workStatus
 * @description Model representation of a workStatus
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/workStatus.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/workStatus.js
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
       * workStatusName
       * @description A workStatus's name
       * @type {Date}
       */

      name: {
        type: 'string'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
    });
  })();

