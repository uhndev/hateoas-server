// api/models/User.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');
var HateoasService = require('../services/HateoasService.js');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  schema: true,
  attributes: {
    studies: {
      collection: 'study',
      via: 'users'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  },
  
  findByStudyName: function(studyName, options, cb) {
    Study.findOneByName(studyName)
      .populate('users')
      .then(function (study) {
        if (!study) {
          err = new Error();
          err.message = require('util')
            .format('Study with name %s does not exist.', studyName);
          err.status = 404;
          return cb(err);
        }  
        cb(false, study.users);
      })
      .catch(function (err) {
        if (err) return cb(err);
      });
  }
});