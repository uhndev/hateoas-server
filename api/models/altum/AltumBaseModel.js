/**
 * AltumBaseModel
 * @class AltumBaseModel
 * @description the basemodel to be inherited by all other models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {
    meta: {
      schemaName: 'altum'
    }
  });

})();
