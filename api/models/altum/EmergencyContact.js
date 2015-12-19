/**
 * EmergencyContact.js
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

schema: true,

  attributes: {

    /**
     * contact
     * @description A emergency contact's associated person
     * @type {model}
     */

    person: {
      model: 'person'
    },


    /**
     * relationship
     * @description A emergencyContact's relationship
     * @type {String}
     */

    relationship: {
      type: 'string'
    },

    /**
     * priority
     * @description A emergencyContact's priority
     * @type {integer}
     */

    priority: {
      type: 'integer'
    },

    /**
     * notes
     * @description A emergencyContact's notes
     * @type {String}
     */

    notes: {
      type: 'string'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)


  }
  });
})();

