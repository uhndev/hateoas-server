/**
 * User
 *
 * @class User
 * @description Model representation of a user
 * @extends https://github.com/tjwebb/sails-permissions/edit/master/api/models/User.js
 * @extends https://github.com/tjwebb/sails-auth/edit/master/api/models/User.js
 */

(function() {

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
      // coordinator/interviewer enrollments at CCs I am overseeing
      enrollments: {
        collection: 'userenrollment',
        via: 'user'
      },
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
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
      EnrollmentService
        .findStudyUsers(studyName, options, currUser)
        .then(function (users) { // send data through to callback function
          return cb(false, users);
        })
        .catch(cb);
    }

  });
})();

