/**
 * ServiceCategory.js
 *
 * @description :: a model representation of a serviceCategory
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

  attributes: {

    /**
     * name
     * @description a serivceCategory's name
     * @type {model}
     */

    name: {
      type: 'string'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();
