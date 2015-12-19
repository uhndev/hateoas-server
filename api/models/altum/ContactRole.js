/**
 * PersonRole.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

(function () {

  var _super = require('../BaseModel.js');
  var _ = require('lodash');
  var HateoasService = require('../../services/HateoasService.js');

  _.merge(exports, _super);
  _.merge(exports, {
  schema:true,

  attributes: {


    /**
     * name
     * @description a person role's name
     * @type {string}
     */

    name: {
      type: 'string'
    },


    /**
     * description
     * @description a person role's description
     * @type {string}
     */

    description: {
      type: 'string'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
  });
})();

