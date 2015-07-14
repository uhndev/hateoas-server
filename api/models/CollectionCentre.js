/**
 * CollectionCentre
 *
 * @class CollectionCentre
 * @description Model representation of a Collection Centre
 * @docs        http://sailsjs.org/#!documentation/models
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
      subjectEnrollments: {
        collection: 'subjectenrollment',
        via: 'collectionCentre'
      },
      userEnrollments: {
        collection: 'userenrollment',
        via: 'collectionCentre'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    findByStudyName: function(studyName, currUser, options, cb) {
      EnrollmentService.findStudyCollectionCentres(studyName, currUser)
      .then(function (centres) {
        cb(false, centres);
      })
      .catch(cb);
    }

  };

}());
