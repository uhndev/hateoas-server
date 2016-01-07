/**
 * PayorProgram.js
 *
 * @description :: A model representing all programs belonging to a particular payor
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
     * payors
     * @description a PayorProgram's payor
     * @type {collection}
     */

    payor: {
      model: 'payor',

    },

    /**
     * name
     * @description a PayorProgram's name
     * @type {String}
     */

    name: {
      type:'string'
    },

    /**
     * ProgramServices
     * @description a payor's ProgramServices
     * @type {String}
     */

    programServices: {
      collection: 'ProgramService',
      via: 'program',
      dominant:true
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();

