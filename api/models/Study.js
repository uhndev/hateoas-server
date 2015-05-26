/**
* Study.js
*
* @description :: Study Model
* @docs        :: http://sailsjs.org/#!documentation/models
*/

(function() {
var HateoasService = require('../services/HateoasService.js');
var PermissionService = require('../services/PermissionService');

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
    /* collection centres should have the form:
      {
        name: 'TGH',
        contact: userId
      }
     */
    collectionCentres: {
      type: 'array'
    },
    users: {
      collection: 'user',
      via: 'studies'
    },
    getResponseLinks: function(id) {
      var overview = {
        'rel': 'overview',
        'prompt': this.name,
        'name': 'name',
        'href': [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name
        ].join('/')
      };
      var subject = { 
        'rel': 'subject', 
        'prompt': 'Subjects', 
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'subject'
        ].join('/')
      };
      var users = { 
        'rel': 'users', 
        'prompt': 'Users', 
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'user'
        ].join('/')
      };
      var form = { 
        'rel': 'form', 
        'prompt': 'Forms', 
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'form'
        ].join('/')
      };
      var encounter = { 
        'rel': 'encounter', 
        'prompt': 'Encounters', 
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'encounter'
        ].join('/')
      };
      var collectioncentres = { 
        'rel': 'collectioncentres', 
        'prompt': 'Collection Centres', 
        'name': 'name',
        'href' : [
          sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'collectioncentres'
        ].join('/')
      };

      var defaultLinks = [overview, subject, users, form, encounter, collectioncentres];
      return defaultLinks;
    },    
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());
