/**
* Person.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

(function() {
  
  var HateoasService = require('../services/HateoasService.js');

  module.exports = {
    schema: true,
    attributes: {
      firstname: {
        type: 'string',
        required: true
      },
      lastname: {
        type: 'string',
        required: true
      },
      prefix: {
        type: 'string',
        enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
        required: true
      },
      gender: {
        type: 'string',
        enum: ['Male', 'Female']
      },
      dob: {
        type: 'date'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    }
  };

}());
