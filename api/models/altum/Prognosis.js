/**
 * Prognosis
 *
 * @class prognosis
 * @description Model representation of a prognosis
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/prognosis.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/prognosis.js
 */

  (function () {

    var _super = require('./BaseModel.js');
    var _ = require('lodash');
    var HateoasService = require('../../services/HateoasService.js');

    _.merge(exports, _super);
    _.merge(exports, {

    schema: true,
    attributes: {

      /**
       * prognosisName
       * @description A prognosis's name
       * @type {Date}
       */

      name: {
        type: 'string'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)


    }
    });
  })();

