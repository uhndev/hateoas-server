/**
 * ProgramService.js
 *
 * @description :: A model representing all services belonging to a particular payor program
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
     * PayorProgram
     * @description a ProgramService's PayorProgram
     * @type {model}
     */

    payorPrograms: {
      collection: 'payorProgram',
      via: 'programServices'
    },

    /**
     * name
     * @description a ProgramService's name
     * @type {String}
     */

    name: {
      type:'string'
    },

    toJSON: HateoasService.makeToHATEOAS.call(this, module)

  }
  });
})();

