/**
* CollectionCentre.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
(function() {
var HateoasService = require('../services/HateoasService.js');

module.exports = {
	schema: true,
  attributes: {
  	name: {
      type: 'string',
      required: true
    },
    contact: {
    	model: 'user'
    },
    studyCollectionCentres: {
    	model: 'study'
    },
    subjects: {
    	collection: 'subject',
    	via: 'collectionCentre'
    },
  	toJSON: HateoasService.makeToHATEOAS.call(this, module)
  }
};

}());

