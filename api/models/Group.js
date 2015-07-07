/**
* Group
*
* @class Group
* @description Model representation of a group.
* @docs        http://sailsjs.org/#!documentation/models
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

