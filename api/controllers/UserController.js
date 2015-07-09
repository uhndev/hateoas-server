/**
 * UserController
 *
 * @module controllers/User
 * @description Server-side logic for managing users.
 */

(function() {

  var _ = require('lodash');
  var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

  _.merge(exports, require('sails-permissions/api/controllers/UserController'));
  _.merge(exports, {

    /**
     * find
     * @description finds and returns all users with populated roles associations
     */
    find: function (req, res, next) {
      var query = User.find()
        .where( actionUtil.parseCriteria(req) )
        .limit( actionUtil.parseLimit(req) )
        .skip( actionUtil.parseSkip(req) )
        .sort( actionUtil.parseSort(req) );

      query.populate('roles');
      query.exec(function found(err, users) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(users);
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
              return CollectionCentre.findOne(enrollment.collectionCentre)
                .then(function (centre) {
                  enrollment.study = centre.study;
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
      var password = req.param('password');

      User.create({
        username: req.param('username'),
        email: req.param('email'),
        prefix: req.param('prefix'),
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        gender: req.param('gender'),
        dob: req.param('dob'),
        group: req.param('group')
      }).exec(function (uerr, user) {
        if (uerr || !user) {
          return res.badRequest({
            title: 'User Error',
            code: 400,
            message: 'Error creating user'
          });
        } else {
          if (_.isEmpty(password)) {
            user.destroy(function (destroyErr) {
              return res.badRequest({
                title: 'User Error',
                code: 400,
                message: 'Password cannot be empty'
              });
            });
          } else {
            Passport.create({
              protocol : 'local',
              password : password,
              user     : user.id
            }, function (err, passport) {
              if (err) {
                user.destroy(function (destroyErr) {
                  next(destroyErr || err);
                });
              }
              res.ok(user);
            });
          }
        }
      });
    },

    /**
     * update
     * @description Route for handling update of user attributes
     */
    update: function (req, res) {
      var userId = req.param('id');

      var userFields = {
        username: req.param('username'),
        email: req.param('email'),
        prefix: req.param('prefix'),
        firstname: req.param('firstname'),
        lastname: req.param('lastname'),
        gender: req.param('gender'),
        dob: req.param('dob'),
        group: req.param('group'),
        centreAccess: req.param('centreAccess')
      };

      Group.findOne(req.user.group).then(function (group) {
        this.group = group;
        if (group.level > 1) { // prevent all non-admin users from updating group
          delete userFields.group;
        }
        return User.findOne(userId);
      })
      .then(function (user) { // update user fields
        this.previousGroup = user.group;
        return User.update({id: user.id}, userFields);
      })
      .then(function (user) { // updating group, apply new permissions
        if (this.previousGroup !== userFields.group && this.group.level === 0) {
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
        res.serverError(err);
      });
    },

    /**
     * updateAccess
     * @description Route for handling collection centre access from study users page
     */
    updateAccess: function (req, res, next) {
      // user params
      var userId = req.param('id');
      // user access enrollment params
      var fields = {},
          collectionCentre = req.param('collectionCentre'),
          user = req.param('user'),
          centreAccess = req.param('centreAccess');

      if (collectionCentre) fields.collectionCentre = collectionCentre;
      if (user) fields.user = user;
      if (centreAccess) fields.centreAccess = centreAccess;

      // find and create or update user enrollment data
      UserEnrollment
        .findOne({
          user: fields.user,
          collectionCentre: fields.collectionCentre,
          expiredAt: null
        })
        .then(function (enrollment) {
          if (!enrollment) {
            return UserEnrollment.create(fields)
              .then(function (enrollment) {
                this.enrollment = enrollment;
                return User.findOne(userId).populate('enrollments');
              })
              .then(function (user) {
                // if we were modifying an enrollment, nothing needs to be done
                if (!_.includes(_.pluck(user.enrollments, 'id'), this.enrollment.id)) {
                  return user;
                } else {
                  // otherwise, we are adding a new enrollment
                  user.enrollments.add(this.enrollment.id);
                  return user.save();
                }
              })
              .then(function (user) {
                res.ok(user);
              });
          } else {
            // otherwise we're trying to update an enrollment to something that already exists
            res.badRequest({
              title: 'Enrollment Error',
              status: 400,
              message: 'Unable to enroll user, user may already be registered at another collection centre.'
            });
          }
        })
        .catch(function (err) {
          res.serverError(err);
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
          res.serverError(err);
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
          res.serverError(err);
        });
      }
    },

    /**
     * findByStudyName
     * @description Calls the User model function findByStudyName to return the list
     *              of users that are enrolled in a given study.  Further filtering
     *              of users based on enrollment is also done in the User model function.
     */
    findByStudyName: function(req, res) {
      var studyName = req.param('name');
      User.findByStudyName(studyName, req.user,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) },
        function(err, users) {
          if (err) {
            res.serverError(err);
          }
          res.ok(users);
        });
    }

  });
})();
