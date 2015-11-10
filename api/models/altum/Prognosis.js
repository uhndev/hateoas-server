/**
 * Prognosis
 *
 * @class prognosis
 * @description Model representation of a prognosis
 *
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

