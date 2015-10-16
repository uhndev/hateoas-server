/**
 * Physician.js
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
     * contact
     * @description a physician's contact
     * @type {String}
     */
    // TODO: Causes infinite loop with Hateoas Templating:
    // client -> (contact -> address --> physician) -> (contact -> address -> physician)...
    //contact: {
    //  model: 'Contact'
    //}


    name: {
      type: 'string'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
  });
})();


