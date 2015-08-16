var HateoasService = require('../../services/HateoasService.js');
module.exports = {
  migrate: 'safe',
  attributes: {
  	id: {
      type: 'integer'
    },
    owner: {
    	type: 'user'
    },
    createdBy: {
    	type: 'user'
    },
    createdAt: {
      type: 'date'
    },
    updatedAt: {
      type: 'date'
    },
  }
};
