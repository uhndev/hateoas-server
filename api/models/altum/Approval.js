/**
 * approval
 *
 * @class approval
 * @description Model representation of a approval
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

    attributes: {

      /**
       * approver
       * @description A approval's approver
       * @type {Model}
       */
      approver: {
        model: 'approver'
      },

      /**
       * approvalDate
       * @description A approval's date
       * @type {date}
       */
      approvalDate: {
        type: 'date'
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }

  });
})();

