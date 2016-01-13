var HateoasService = require('../../services/HateoasService.js');

module.exports = {
  migrate: 'safe',
  attributes: {
    id: {
      type: 'integer'
    },
    owner: {
      model: 'user'
    },
    createdBy: {
      model: 'user'
    },
    createdAt: {
      type: 'date'
    },
    updatedAt: {
      type: 'date'
    }
  }
};
