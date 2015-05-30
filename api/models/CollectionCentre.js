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
      study: {
      	model: 'study',
      	required: true
      },
      contact: {
        model: 'user'
      },
      // for subjects enrolled in a particular CC
      subjects: {
      	collection: 'subject',
      	via: 'collectionCentres'
      },
      // for coordinators/interviewer roles at a CC
      coordinators: { 
      	collection: 'user',
      	via: 'collectionCentres'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    findByStudyName: function(studyName, options, cb) {
      Study.findOneByName(studyName)
      .populate('collectionCentres')
      .then(function (study) {
        if (!study) {
          err = new Error();
          err.message = require('util')
            .format('Study with name %s does not exist.', studyName);
          err.status = 404;
          return cb(err);
        }
        
        var query = _.cloneDeep(options);
        query.where = query.where || {};
        query.where.study = study.id;
        delete query.where.name;

        return CollectionCentre.find(query)
          .populate('coordinators')
          .populate('subjects');
      })
      .then(function (centres) {
        cb(false, centres);
      })
      .catch(cb);
    },
  };

}());
