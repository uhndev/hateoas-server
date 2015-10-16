/**
 * Employer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {

  attributes: {

    /**
     * name
     * @description An employer's name
     * @type {String}
     */

    name: {
      type: 'string'
    },

    /**
     * contact
     * @description An employer's contact
     * @type {model}
     */

    /*contact: {
      model: 'contact'
    }*/
    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
  });
})();


