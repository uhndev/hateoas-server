/**
 * approval
 *
 * @class approval
 * @description Model representation of a approval
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/approval.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/approval.js
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
       * approver
       * @description A approval's approver
       * @type {model}
       */
      approver: {
        model: 'approver'
      },

      /**
       * recommendation
       * @description A approval's recmmendation
       * @type {model}
       */
      recommendation: {
        string: 'recommendation'
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

