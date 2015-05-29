// api/models/User.js

var _ = require('lodash');
var Q = require('q');
var _super = require('sails-permissions/api/models/User');
var HateoasService = require('../services/HateoasService.js');

_.merge(exports, _super);
_.merge(exports, {
  
  schema: true,
  attributes: {
    person: {
      model: 'person'
    },
    // administrators/PIs of a study
    studies: { 
      collection: 'study',
      via: 'users'
    },
    // coordinator/interviewer CCs I am overseeing
    collectionCentres: {
      collection: 'collectioncentre',
      via: 'coordinators'
    },
    /**
     * records CC:roleId mappings 
     * should be of the form:
     * { CCid1: roleId, CCid2: roleId2 }
     */
    centreAccess: {
      type: 'json'
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

        // TODO: fix query on submenu pages
        // var query = _.cloneDeep(options);
        // query.where = query.where || {};
        // query.where.study = study.id;
        // delete query.where.name;
        return Utils.User.populateAndFormat(study.users);  
      })
      .then(function (users) {
        cb(false, users);
      })
      .catch(cb);
  }
});