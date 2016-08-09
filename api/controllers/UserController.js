  var bcrypt = require('../../node_modules/sails-auth/node_modules/bcryptjs');
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

  _.merge(exports, require('sails-auth/dist/api/controllers/UserController'));
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
        .exec(function (err, totalUsers) {
          var query = ModelService.filterExpiredRecords('user');
          query
            .where( whereQuery )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );
          query.populate('roles');
          query.exec(function found(err, users) {
            if (err) {
              res.serverError(err);
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
      var query = User.findOne(req.param('id'));
      query = actionUtil.populateRequest(query, req);
      query.populate('enrollments');
      query.then(function (user) {
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
                enrollment.study = centre.study.id;
                enrollment.studyName = centre.study.name;
                return enrollment;
              });
          })
        );
      })
      .then(function (enrollments) {
        this.user.enrollments = enrollments;
        Provider.findOne({ user: this.user.id }).populate('subjects').then(function (provider) {
          if (provider) {
            studysubject.find({ id: _.pluck(provider.subjects, 'id') }).then(function (providerSubjects) {
              this.user.providerSubjects = providerSubjects;
              res.ok(this.user, { links: user.getResponseLinks() });
            });
          } else {
            res.ok(this.user, { links: user.getResponseLinks() });
          }
        });
      })
      .catch(function (err) {
        res.serverError(err);
      });
    },

    /**
     * findPermissions
     * @description Endpoint for returning all role permissions and user permissions for a given user
     * @param req
     * @param res
     */
    findPermissions: function (req, res) {
      var resp = {};
      return User.findOne(req.param('id')).populate('roles')
        .then(function (user) {
          this.user = user;
          return Permission.find({user: user.id})
                           .populate(['role', 'model', 'criteria', 'user']);
        })
        .then(function (userPermissions) {
          resp.permissions = userPermissions;
          return Permission.find({role: _.pluck(this.user.roles, 'id')})
                           .populate(['role', 'model', 'criteria', 'user']);
        })
        .then(function (rolePermissions) {
          resp.roles = _.map(rolePermissions, function (rolePermission) {
            rolePermission.roleName = rolePermission.role.name;
            return rolePermission;
          });
          res.ok(resp);
        })
        .catch(res.badRequest);
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
          return Group.findOne(personInfo.group).then(function (newGroup) {
            if (!newGroup) {
              err = new Error('Group '+personInfo.group+' does not exist.');
              err.status = 400;
              throw err;
            }
            return User.update({id: createdUser.id}, personInfo);
          });
        })
        .then(function (updatedUser) {
          return PermissionService.setDefaultGroupRoles(_.first(updatedUser))
            .then(function () {
              res.ok(_.first(updatedUser));
            })
            .catch(function (err) {
              user.destroy(function (destroyErr) {
                next(destroyErr || err);
              });
            });
        })
        .catch(function (err) {
          res.badRequest(err);
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

      if (req.user.group !== 'admin') { // prevent all non-admin users from updating group
        delete options.group;
      }

      User.findOne(userId)
        .then(function (user) { // update user fields
          this.previousGroup = user.group;
          return User.update({id: user.id}, options);
        })
        .then(function (user) { // updating group, apply new permissions
          this.user = _.first(user);
          if (this.previousGroup !== options.group && req.user.group === 'admin') {
            return PermissionService.swapGroups(userId, this.previousGroup, options.group);
          }
          return null;
        })
        .then(function () { // compares the current password to the changed one, if different update expiredPassword
          var password = req.param('password');
          if (!_.isEmpty(password)) {
            return Passport.findOne({ user : userId }).then(function (passport) {
              var expired = bcrypt.compareSync(password, passport.password);
              return User.update({id: userId}, {expiredPassword: expired}).then(function (user) {
                return passport;
              });
            });
          }
          return null;
        })
        .then(function(passport){ // updates the users passport and changes the email if there was a change
          if (!_.isEmpty(req.param('password')) && passport) {
            return Passport.update(passport.id, { password : req.param('password') });
          }
        })
        .then(function () {
          res.ok(this.user);
        })
        .catch(function (err) {
          res.badRequest(err);
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
          this.user = user;
          return user.save();
        })
        .then(function () {
          return PermissionService.setDefaultGroupRoles(this.user);
        })
        .then(function () {
          res.ok(this.user);
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
    }

  });
})();
