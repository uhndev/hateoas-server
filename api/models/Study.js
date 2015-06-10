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
    // encapsulates access restrictions of coordinator/interviewer/subjects
    collectionCentres: {
      collection: 'collectioncentre',
      via: 'study'
    },
    // oversees all collection centres as admin/PI
    administrator: {
      model: 'user'
    },
    pi: {
      model: 'user'
    },

    getResponseLinks: function(id) {
      return [
        {
          'rel': 'overview',
          'prompt': this.name,
          'name': 'name',
          'href': [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name
          ].join('/')
        },
        { 
          'rel': 'subject', 
          'prompt': 'Subjects', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'subject'
          ].join('/')
        },
        { 
          'rel': 'user', 
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
          'rel': 'survey', 
          'prompt': 'Surveys', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'survey'
          ].join('/')
        },
        { 
          'rel': 'collectioncentre', 
          'prompt': 'Collection Centres', 
          'name': 'name',
          'href' : [
            sails.getBaseUrl() + sails.config.blueprints.prefix, 'study', this.name, 'collectioncentre'
          ].join('/')
        }
      ]
    },    
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());
