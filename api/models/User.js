// api/models/User.js

var _ = require('lodash');
var Q = require('q');
var _super = require('sails-permissions/api/models/User');
var HateoasService = require('../services/HateoasService.js');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  schema: true,
  attributes: {
    person: {
      model: 'person'
    },
    studies: {
      collection: 'study',
      via: 'users'
    },
    /**
     * {
     *   study: studyId,
     *   role: [coordinatorRoleId or interviewerRoleId],
     *   collectionCentre: ccName
     * }
     */
    centreAccess: {
      type: 'array'
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  },

  afterCreate: function setOwner (user, next) {
    sails.log('User.afterCreate.setOwner', user);
    User
      .update({ id: user.id }, { owner: user.id })
      .then(function (user) {
        next();
      })
      .catch(next);
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

        return Utils.User.populateAndFormat(study.users);
      })
      .then(function (users) {
        cb(false, users);
      })
      .catch(function (err) {
        if (err) return cb(err);
      });
  }
});