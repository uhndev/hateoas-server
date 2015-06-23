/**
* Group.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var HateoasService = require('../services/HateoasService.js');

module.exports = {

  attributes: {
  	name: {
  		type: 'string',
  		required: true,
  		unique: true
  	},
  	users: {
  		collection: 'user',
  		via: 'group'
  	},
  	roles: {
  		collection: 'role',
  		via: 'groups'
  	},
  	tabview: {
  		type: 'array'
  	},
  	subview: {
  		type: 'array'
  	},
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

