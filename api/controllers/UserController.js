/**
 * UserController
 *
 * @module controllers/User
 * @description Server-side logic for managing users.
 */

(function() {
  var Promise = require('bluebird');
  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  _.merge(exports, require('sails-permissions/api/controllers/UserController'));
  _.merge(exports, {

    /**
     * find
     * @description finds and returns all users with populated roles associations
     */
    find: function (req, res) {
      var whereQuery = actionUtil.parseCriteria(req);
      // admins have every permission so omit subject users from search
      if (req.user.group == 'admin') {
        whereQuery = _.merge(actionUtil.parseCriteria(req), {group: {'!': 'subject'}});
      }

      ModelService.filterExpiredRecords('user').where( whereQuery )
        .then(function (totalUsers) {
          var query = ModelService.filterExpiredRecords('user');
          query
            .where( whereQuery )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );
          query.populate('roles');
          query.exec(function found(err, users) {
            if (err) {
              return res.serverError(err);
            }
            if (req.user.group == 'admin') {
              res.ok(users, { filteredTotal: totalUsers.length });
            } else {
              res.ok(users);
            }
          });
        });
    },

    /**
     * findOne
     * @description finds one user by id and returns single user with populated collection centre association
     */
    findOne: function (req, res, next) {
      User.findOne(req.param('id'))
        .populate('enrollments')
        .then(function (user) {
          if(!user) {
            return res.notFound({
              title: 'Not Found',
              code: 404,
              message: 'No record found with the specified id.'
            });
          }

          this.user = user;
          return Promise.all(
            _.map(_.filter(this.user.enrollments, { expiredAt: null }), function (enrollment) {
              return CollectionCentre.findOne(enrollment.collectionCentre).populate('study')
                .then(function (centre) {
                  enrollment.collectionCentre = centre.id;
                  enrollment.collectionCentreName = centre.name;
                  enrollment.study = centre.study.name;
                  return enrollment;
                });
            })
          );
        })
        .then(function (enrollments) {
          this.user.enrollments = enrollments;
          res.ok(this.user);
        })
        .catch(function (err) {
          res.serverError(err);
        });
    },

    /**
     * create
     * @description Overrides sails-auth's UserController.create to include role
     */
    create: function (req, res, next) {
      var userOptions = _.pick(_.pick(req.body,
        'username', 'email', 'password'
      ), _.identity);
      var personInfo = _.pick(_.pick(req.body,
        'prefix', 'firstname', 'lastname', 'gender', 'dob', 'group'
      ), _.identity);

      User
        .register(userOptions)
        .then(function (createdUser) {
          return User.update({id: createdUser.id}, personInfo);
        })
        .then(function (updatedUser) {
          return PermissionService.setUserRoles(_.first(updatedUser))
            .then(function (user) {
              res.ok(user);
            })
            .catch(function (err) {
              user.destroy(function (destroyErr) {
                next(destroyErr || err);
              });
            });
        })
        .catch(function (err) {
          next(err);
        });
    },

    /**
     * update
     * @description Route for handling update of user attributes
     */
    update: function (req, res) {
      var userId = req.param('id');
      var options = _.pick(_.pick(req.body,
        'username', 'email', 'prefix', 'firstname', 'lastname', 'gender', 'dob', 'group'
      ), _.identity);

      Group.findOne(req.user.group).then(function (group) {
        this.group = group;
        if (group.level > 1) { // prevent all non-admin users from updating group
          delete options.group;
        }
        return User.findOne(userId);
      })
      .then(function (user) { // update user fields
        this.previousGroup = user.group;
        return User.update({id: user.id}, options);
      })
      .then(function (user) { // updating group, apply new permissions
        if (this.previousGroup !== options.group && this.group.level === 1) {
          return PermissionService.setUserRoles(_.first(user));
        } else {
          return user;
        }
      })
      .then(function (user) { // find and update user's associated passport
        this.user = user;
        if (!_.isEmpty(req.param('password'))) {
          return Passport.findOne({ user : userId }).then(function (passport) {
            return Passport.update(passport.id, { password : req.param('password') });
          });
        }
        return this.user;
      })
      .then(function (user) {
        res.ok(this.user);
      })
      .catch(function (err) {
        res.serverError({
          title: 'User Update Error',
          code: 500,
          message: 'An error occurred when updating user: ' + options.username + ' ' + err.details
        });
      });
    },

    /**
     * updateRoles
     * @description Route for handling role updates from access management page
     */
    updateRoles: function (req, res, next) {
      // user params
      var userId = req.param('id');
      // access control params
      var roles = req.param('roles'),
          updateGroup = req.param('updateGroup');

      // Update user role from access management
      if (!_.isUndefined(updateGroup)) {
        return User.findOne(userId).populate('roles')
        .then(function (user) {
          user.group = updateGroup;
          return user.save();
        })
        .then(function (user) {
          return PermissionService.setUserRoles(user);
        })
        .then(function (user) {
          res.ok(user);
        })
        .catch(function (err) {
          res.serverError({
            title: 'Role Update Error',
            code: 500,
            message: 'Error when updating roles for user: ' + user.username
          });
        });
      }
      // Update user access matrix
      else if (!_.isUndefined(roles)) {
        return User.findOne(userId)
        .then(function (user) {
          return PermissionService.grantPermissions(user, roles);
        })
        .then(function (user) {
          res.ok(user);
        })
        .catch(function (err) {
          res.serverError({
            title: 'Role Update Error',
            code: 500,
            message: 'Error when updating access roles for user: ' + userId
          });
        });
      }
    }

  });
})();
