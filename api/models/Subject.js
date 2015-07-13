/**
* Subject
*
* @class Subject
* @description Model representation of a subject
* @docs        http://sailsjs.org/#!documentation/models
*/

(function() {

  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  module.exports = {
    schema: true,
    attributes: {
      user: {
        model: 'user',
        required: true
      },
      enrollments: {
        collection: 'subjectenrollment',
        via: 'subject'
      },
      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    findByStudyName: function(studyName, currUser, options, cb) {
      // TODO
      Subject.find().exec(function (err, subjects) {
        cb(false, subjects);
      });
      // EnrollmentService
      //   .findStudySubjects(studyName, currUser)
      //   .then(function (users) { // send data through to callback function
      //     return cb(false, users);
      //   })
      //   .catch(cb);
    }

  };

}());
