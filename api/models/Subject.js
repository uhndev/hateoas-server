/**
* Subject
*
* @class Subject
* @description Model representation of a subject
* @docs        http://sailsjs.org/#!documentation/models
*/


(function() {
  var _super = require('./BaseModel.js');
  var faker = require('faker');

  var HateoasService = require('../services/HateoasService.js');
  var _ = require('lodash');

  _.merge(exports, _super);
  _.merge(exports, {
    schema: true,

    attributes: {
      /**
       * user
       * @description Associated user that this subject belongs to.  The User
       *              model holds the personal data as well as the access
       *              attributes for logging in and permissions.
       *
       * @type {Association}
       */
      user: {
        model: 'user',
        required: true,
        generator: function (state) {
          return BaseModel.defaultGenerator(state, 'user', User);
        }
      },

      /**
       * enrollments
       * @description List of subject enrollments storing which collection centres
       *              and studies I, as a subject am enrolled in.
       *
       * @type {Association}
       */
      enrollments: {
        collection: 'subjectenrollment',
        via: 'subject'
      },

      /**
       * expiredAt
       * @description Instead of strictly deleting objects from our system, we set a date such
       *              that if it is not null, we do not include this entity in our response.
       * @type {Date} Date of expiry
       */
      expiredAt: {
        type: 'datetime',
        defaultsTo: null,
        datetime: true
      },

      toJSON: HateoasService.makeToHATEOAS.call(this, module)
    },

    /**
     * afterUpdate
     * @description Lifecycle callback meant to handle deletions in our system; if at
     *              any point we set this subject's expiredAt attribute, this function
     *              will check and invalidate any active user/subject enrollments.
     *
     * @param  {Object}   updated updated subject object
     * @param  {Function} cb      callback function on completion
     */
    afterUpdate: function(updated, cb) {
      if (!_.isNull(updated.expiredAt)) {
        UserEnrollment.update({ user: updated.user }, { expiredAt: new Date() })
        .then(function (userEnrollments) {
          return SubjectEnrollment.update({ subject: updated.id }, { expiredAt: new Date() });
        })
        .then(function (subjectEnrollments) {
          cb();
        })
        .catch(cb);
      } else {
        cb();
      }
    },

    afterCreate: function (values, cb) {
      User.findOne(values.user)
        .then(function (user) {
          this.user = user;
          this.roleName = ['Subject', values.id, 'Role'].join('');
          return Role.findOne({ name: this.roleName });
        })
        .then(function (role) {
          if (_.isUndefined(role)) {
            return PermissionService.createRole({
              name: this.roleName,
              permissions: [
                {
                  model: 'studysubject',
                  action: 'read',
                  criteria: [
                    { where: { subject: values.id } }
                  ]
                },
                {
                  model: 'schedulesubjects',
                  action: 'read',
                  criteria: [
                    { where: { subject: values.id } }
                  ]
                }
              ],
              users: [ this.user.username ]
            });
          } else {
            if (this.user.group != 'admin') {
              return PermissionService.addUsersToRole(this.user.username, this.roleName);
            }
            return role;
          }
        })
        .then(function (newRole) {
          cb();
        }).catch(cb);
    }

  });

}());
