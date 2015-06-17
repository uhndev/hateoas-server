// api/models/User.js

var _ = require('lodash');
var Q = require('q');
var _super = require('sails-permissions/api/models/User');
var HateoasService = require('../services/HateoasService.js');

_.merge(exports, _super);
_.merge(exports, {
  
  schema: true,
  attributes: {
    // one-way association to a person
    person: {
      model: 'person'
    },
    // fixed enum of roles that will dictate data format returned
    role: {
      type: 'string',
      enum: ['admin', 'coordinator', 'physician', 'interviewer', 'subject']
    },
    // coordinator/interviewer CCs I am overseeing
    collectionCentres: {
      collection: 'collectioncentre',
      via: 'coordinators'
    },
    // key value pair of ccID: user.role to denote a user's access
    centreAccess: {
      type: 'json',
      defaultsTo: {}
    },
    toJSON: HateoasService.makeToHATEOAS.call(this, module)
  },

  afterCreate: function(user, cb) {
    var promise;
    switch (user.role) {
      case 'admin': 
        promise = PermissionService.grantAdminPermissions(user); break;
      case 'coordinator': 
        promise = PermissionService.grantCoordinatorPermissions(user); break;
      case 'physician': 
        promise = PermissionService.grantPhysicianPermissions(user); break;
      case 'interviewer': 
        promise = PermissionService.grantInterviewerPermissions(user); break;
      case 'subject': 
        promise = PermissionService.grantSubjectPermissions(user); break;
      default: break;
    }

    if (_.has(user, 'role')) {
      promise.then(function (user) {
        cb();
      }).catch(function (err) {
        cb(err);
      });  
    } else {
      cb();
    }
  },

  findByStudyName: function(studyName, currUser, options, cb) {
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

        this.study = study;        
        return study.collectionCentres;
      })
      .then(function (centres) {
        if (currUser.role !== 'admin') {
          return User.findOne(currUser.id).populate('collectionCentres')
            .then(function (user) {
              return _.filter(user.collectionCentres, function (centre) {
                return _.includes(_.pluck(centres, 'id'), centre.id );
              });
            });
        } 
        return centres;
      })
      .then(function (centres) {
        // return all coordinators from each study's collection centres
        return Promise.all(
          _.map(centres, function (centre) {
            return CollectionCentre.findOne(centre.id).populate('coordinators');
          })
        );
      })
      .then(function (centres) {
        // return list of users that have access to collection centres
        var centreIds = _.pluck(centres, 'id');
        var users = _.uniq(_.flattenDeep(_.pluck(centres, 'coordinators')), 'id');

        _.each(centreIds, function (centreId) {
          _.each(users, function (user) {
            if (!user.accessCollectionCentre) {
              user.accessCollectionCentre = [];
            }
            if (user.centreAccess[centreId]) {
              user.accessRole = user.centreAccess[centreId];
              user.accessCollectionCentre.push(centreId);
            }
          });
        });       

        return Utils.User.populateUsers(users);
        // return users;
      })
      // .then(function (users) {
      //   // TODO: FIX THIS - unable to query on populated values
      //   var query = _.cloneDeep(options);
      //   query.where = query.where || {};
      //   delete query.where.name;

      //   this.coordinators = _.pluck(users, 'id');
      //   return User.find(query).populate('person');
      // })
      // .then(function (users) {
      //   return Utils.User.populateUsers(users);
      // })
      // .then(function (users) {
      //   return _.filter(users, function (user) {
      //     return _.includes(this.coordinators, user.id);
      //   });
      // })
      .then(function (users) {
        cb(false, users);
      })
      .catch(cb);
  }
});