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
    level: {
      type: 'integer',
      enum: [1, 2, 3]
    },
  	users: {
  		collection: 'user',
  		via: 'group'
  	},
  	roles: {
  		collection: 'role',
  		via: 'groups'
  	},
  	menu: {
  		type: 'json'
  	},
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

