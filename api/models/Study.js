/**
* Study.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    getResponseLinks: function(id) {
      return [
        { 
          'rel': 'subject', 
          'prompt': 'Subjects', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() +
            sails.config.blueprints.prefix,
            'study',
            this.name,
            'subject'
          ].join('/')
        }
      ];
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());
