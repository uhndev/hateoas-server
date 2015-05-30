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
    centreAccess: {
      type: 'json',
      defaultsTo: {}
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
      .populate('collectionCentres')    
      .then(function (study) {
        if (!study) {
          err = new Error();
          err.message = require('util')
            .format('Study with name %s does not exist.', studyName);
          err.status = 404;
          return cb(err);
        }

        this.study = study;
        // TODO: FIX THIS
        
        return study.collectionCentres;
      })
      .then(function (centres) {
        return Promise.all(
          _.map(centres, function (centre) {
            return CollectionCentre.findOne(centre.id).populate('coordinators');
          })
        );
      })
      .then(function (centres) {
        var users = [];
        _.each(centres, function (centre) {
          _.each(centre.coordinators, function (coordinator) {
            // user has access to CC with defined role
            if (coordinator.centreAccess[centre.id]) {
              coordinator.access = {
                role: coordinator.centreAccess[centre.id], // coordinator/interviewer role
                collectionCentre: centre.name
              };
            } else {
              coordinator.access = {
                role: 'NONE',
                collectionCentre: 'NONE'
              };
            }
            users.push(coordinator);
          });
        });        
        return users;
      })
      .then(function (users) {
        var query = _.cloneDeep(options);
        query.where = query.where || {};
        delete query.where.name;

        this.coordinators = _.pluck(users, 'id');
        return User.find(query).populate('person');
      })
      .then(function (users) {
        return Utils.User.populateAndFormat(users);
      })
      .then(function (users) {
        return _.filter(users, function (user) {
          return _.includes(this.coordinators, user.id);
        });
      })
      .then(function (users) {
        cb(false, users);
      })
      .catch(cb);
  }
});