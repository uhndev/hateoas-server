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

    attributes: {

      /**
       * collectionCentre
       * @description The collection centre for which this subject is enrolled in.
       * @type {Association} linked collection centre in enrollment
       */
      collectionCentre: {
        model: 'collectioncentre',
        required: true,
        generator: function(state) {
          return BaseModel.defaultGenerator(state, 'collectionCentre', CollectionCentre);
        }
      },

      /**
       * user
       * @description Many to one association between user enrollments and users.
       * @type {Association} linked coordinator in enrollment
       */
      user: {
        model: 'user',
        required: true,
        generator: function() {
          return BaseModel.defaultGenerator(state, 'user', User);
        }
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
        enum: ['coordinator', 'interviewer'],
        generator: function() {
          return _.sample(UserEnrollment.attributes.centreAccess.enum);
        }
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

    afterCreate: function (values, cb) {
      CollectionCentre.findOne(values.collectionCentre).exec(function (err, centre) {
        if (err || !centre) {
          cb(err);
        } else {
          User.findOne(values.user).then(function (user) {
            this.user = user;
            this.roleName = ['CollectionCentre', values.collectionCentre, 'Role'].join('');
            return Role.findOne({ name: this.roleName });
          })
          .then(function (role) {
            if (_.isUndefined(role)) {
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
                  },
                  {
                    model: 'studysubject',
                    action: 'read',
                    criteria: [
                      { where: { collectionCentre: values.collectionCentre } }
                    ]
                  },
                  {
                    model: 'schedulesubjects',
                    action: 'read',
                    criteria: [
                      { where: { collectionCentre: values.collectionCentre } }
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
     * findByBaseModel
     * @description End function for handling /api/study/:name/user.  Should return a list
     *              of users in a given study and depending on the current users' group
     *              permissions, this list will be further filtered down based on whether
     *              or not those users and I share common collection centres.
     *
     * @param  {String}   studyID   Name of study to search.  Passed in from UserController.
     * @param  {Object}   currUser  Current user used in determining filtering options based on access
     * @param  {Object}   options   Query options potentially passed from queryBuilder in frontend
     */
    findByBaseModel: function(studyID, currUser, options) {
      var query = _.cloneDeep(options);
      query.where = query.where || {};
      delete query.where.id;

      return Study.findOne(studyID).then(function (study) {
          this.links = study.getResponseLinks();
          return studyuser.find(query).where({ study: studyID })
        })
        .then(function (studyUsers) {
          return {
            data: studyUsers,
            links: this.links
          };
        });
    }

  });

})();

