/**
* Person.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {

  attributes: {
    userName: {
      type: 'string',
      required: true
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    dob: {
      type: 'date'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());
