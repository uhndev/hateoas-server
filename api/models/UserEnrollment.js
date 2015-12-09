/**
* UserEnrollment
*
* @class UserEnrollment
* @description Model representation of a user's enrollment/involvement in a collection centre
* @docs        http://sailsjs.org/#!documentation/models
*/


(function() {
  var _super = require('./BaseModel.js');
  var _ = require('lodash');
  var UserModel = require('./User.js');

  _.merge(exports, _super);
  _.merge(exports, {
    schema: true,
    attributes: {

      /**
       * collectionCentre
       * @description The collection centre for which this subject is enrolled in.
       * @type {Association} linked collection centre in enrollment
       */
      collectionCentre: {
        model: 'collectioncentre',
        required: true
      },

      /**
       * user
       * @description Many to one association between user enrollments and users.
       * @type {Association} linked coordinator in enrollment
       */
      user: {
        model: 'user',
        required: true
      },

      /**
       * centreAccess
       * @description For a particular user enrollment, a user can have multiple
       *              views of the data.  For example, a user can oversee a
       *              collection centre as a coordinator, and can oversee another
       *              collection centre as an interviewer.
       * @type {String} string value denoting type of view/access this user has.
       */
      centreAccess: {
        type: 'string',
        enum: ['coordinator', 'interviewer']
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

      toJSON: UserModel.attributes.toJSON
    },

    /**
     * beforeCreate
     * @description Lifecycle method for ensuring valid user enrollments
     */
    beforeCreate: function (values, cb) {
      // find and create or update user enrollment data
      UserEnrollment
        .findOne({
          user: values.user,
          collectionCentre: values.collectionCentre,
          expiredAt: null
        })
        .then(function (enrollment) {
          if (!enrollment) {
            cb();
          } else {
            // otherwise we're trying to update an enrollment to something that already exists
            cb({
              title: 'Enrollment Error',
              status: 400,
              message: 'Unable to enroll user, user may already be registered at another collection centre.'
            });
          }
        }).catch(cb);
    },

    /**
     * beforeUpdate
     * @description Lifecycle method for ensuring valid user enrollments
     */
    beforeUpdate: function (values, cb) {
      // check if we're trying to update an enrollment to something that already exists
      UserEnrollment.findOne({
        collectionCentre: values.collectionCentre,
        user: values.user,
        expiredAt: null,
        id: { '!': values.id }
      })
      .then(function (enrollment) {
        if (!enrollment) { // if no existing enrollment found, update can be performed safely
          cb();
        } else { // otherwise, we are trying to register an invalid enrollment
          cb({
            title: 'Enrollment Error',
            status: 400,
            message: 'Unable to enroll user, user may already be registered at another collection centre.'
          });
        }
      }).catch(cb);
    },

    afterCreate: function (values, cb) {
      CollectionCentre.findOne(values.collectionCentre).exec(function (err, centre) {
        if (err || !centre) {
          cb(err);
        } else {
          User.findOne(values.user).then(function (user) {
              this.user = user;
              this.roleName = ['CollectionCentre', values.collectionCentre, 'Role'].join('');
              return Role.findOne({ name: roleName });
            })
            .then(function (role) {
              if (_.isUndefined(role)) {
                console.log('**************************************');
                console.log(role);
                console.log(_.isUndefined(role));
                console.log('**************************************');
                return PermissionService.createRole({
                  name: this.roleName,
                  permissions: [
                    {
                      model: 'study',
                      action: 'read',
                      criteria: [
                        { where: { id: centre.study } }
                      ]
                    },
                    {
                      model: 'collectioncentre',
                      action: 'read',
                      criteria: [
                        { where: { id: values.collectionCentre } }
                      ]
                    },
                    {
                      model: 'userenrollment',
                      action: 'read',
                      criteria: [
                        { where: { collectionCentre: values.collectionCentre } }
                      ]
                    },
                    {
                      model: 'subjectenrollment',
                      action: 'read',
                      criteria: [
                        { where: { collectionCentre: values.collectionCentre } }
                      ]
                    },
                    {
                      model: 'survey',
                      action: 'read',
                      criteria: [
                        { where: { study: centre.study } }
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
    },

    afterUpdate: function (values, cb) {
      if (!_.isNull(values.expiredAt)) {
        var roleName = ['CollectionCentre', values.collectionCentre, 'Role'].join('');
        User.findOne(values.user)
          .then(function (user) {
            return PermissionService.removeUsersFromRole(user.username, roleName);
          })
          .then(function () {
            cb();
          });
      } else {
        cb();
      }
    },

    /**
     * findByStudyName
     * @description End function for handling /api/study/:name/user.  Should return a list
     *              of users in a given study and depending on the current users' group
     *              permissions, this list will be further filtered down based on whether
     *              or not those users and I share common collection centres.
     *
     * @param  {String}   studyName Name of study to search.  Passed in from UserController.
     * @param  {Object}   currUser  Current user used in determining filtering options based on access
     * @param  {Object}   options   Query options potentially passed from queryBuilder in frontend
     * @param  {Function} cb        Callback function upon completion
     */
    findByStudyName: function(studyName, currUser, options, cb) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.name;
      return User.findOne(currUser.id)
        .populate('enrollments')
        .populate('group')
        .then(function (user) {
          this.user = user;
          return studyuser.find(query).where({ studyName: studyName });
        })
        .then(function (studyUsers) {
          if (this.user.group.level > 1) {
            return [false, _.filter(studyUsers, function (user) {
              // return users whose enrollments has at least one with proposed user
              return (_.some(_.pluck(this.user.enrollments, 'id'), function (currEnrollment) {
                return _.includes(user.userEnrollments, currEnrollment) || user.userEnrollments == currEnrollment;
              }));
            })];
          } else {
            return [false, studyUsers];
          }
        })
        .catch(function (err) {
          return [err, null];
        });
    }

  });

})();

