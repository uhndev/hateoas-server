/**
 * User
 *
 * @class User
 * @description Model representation of a user
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/User.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/User.js
 */

var _ = require('lodash');
var HateoasService = require('../services/HateoasService.js');

_.merge(exports, require('sails-permissions/api/models/User'));
_.merge(exports, {

  schema: true,
  attributes: {
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    prefix: {
      type: 'string',
      enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.']
    },
    gender: {
      type: 'string',
      enum: ['Male', 'Female']
    },
    dob: {
      type: 'date'
    },
    // group of roles this user has
    group: {
      model: 'group'
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

  afterCreate: [
    function setOwner (user, next) {
      sails.log('User.afterCreate.setOwner', user);
      User
        .update({ id: user.id }, { owner: user.id })
        .then(function (user) {
          next();
        })
        .catch(next);
    },
    function grantRoles(user, cb) {
      if (_.has(user, 'group')) {
        PermissionService.setUserRoles(user).then(function (user) {
          cb();
        }).catch(function (err) {
          cb(err);
        });
      } else {
        cb();
      }
    }
  ],

  findByStudyName: function(studyName, currUser, options, cb) {
    Group.findOne(currUser.group).then(function (group) {
      this.group = group;
      return Study.findOneByName(studyName).populate('collectionCentres');
    })
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
      if (this.group.level > 1) {
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
      return cb(false, users);
    })
    .catch(cb);
  }
});
