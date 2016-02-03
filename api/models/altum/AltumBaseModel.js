/**
 * AltumBaseModel
 * @class AltumBaseModel
 * @description The altum base model that inherits from BaseModel and is inherited by all Altum models.
 */
(function () {
  var _super = require('../BaseModel.js');
  var _ = require('lodash');

  _.merge(exports, _super);
  _.merge(exports, {
    meta: {
      schemaName: 'altum'
    }
  });

})();
