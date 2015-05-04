/**
* Study.js
*
* @description :: Study Model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {
  schema: true,
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    reb: {
      type: 'string',
      required: true
    },
    collectionCenters: {
      type: 'array'
    },
    pi: {
      model: 'user' 
    },
    coordinator: {
      model: 'user'
    },
    getResponseLinks: function(id) {
      return [
        { 
          'rel': 'subject', 
          'prompt': 'Subjects', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'subject'
          ].join('/')
        },
        { 
          'rel': 'users', 
          'prompt': 'Users', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'user'
          ].join('/')
        },
        { 
          'rel': 'form', 
          'prompt': 'Forms', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'form'
          ].join('/')
        },
        { 
          'rel': 'encounter', 
          'prompt': 'Encounters', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'encounter'
          ].join('/')
        }
      ];
    },    
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());
