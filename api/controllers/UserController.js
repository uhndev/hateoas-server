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

      userperson.count(whereQuery)
        .exec(function (err, totalUsers) {
          var query = userperson.find();
          query
            .where( whereQuery )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );
          query.exec(function found(err, users) {
            if (err) {
              res.serverError(err);
            }
            res.ok(users, { filteredTotal: totalUsers });
          });
        });
    },

    /**
     * findOne
     * @description finds one user by id and returns single user with populated collection centre association
     */
    findOne: function (req, res) {
      var query = userperson.findOne(req.param('id'));
      query = actionUtil.populateRequest(query, req);
      query.then(function (user) {
          if (!user) {
            return res.notFound({
              title: 'Not Found',
              code: 404,
              message: 'No record found with the specified id.'
            });
          }

          this.user = user;
          return UserEnrollment.find().where({user: user.id, expiredAt: null});
        })
      .then(function (enrollments) {
        return Promise.all(
          _.map(enrollments, function (enrollment) {
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
        'username', 'email', 'password', 'group', 'userType'
      ), _.identity);
      userOptions.person = _.pick(_.pick(req.body,
        'prefix', 'firstName', 'lastName', 'gender', 'dateOfBirth'
      ), _.identity);

      Group.findOne(userOptions.group)
        .then(function (group) {
          if (!group) {
            err = new Error('Group '+userOptions.group+' does not exist.');
            err.status = 400;
            throw err;
          }
          return User.register(userOptions);
        })
        .then(function (createdUser) {
          return PermissionService.setDefaultGroupRoles(createdUser)
            .then(function () {
              res.ok(createdUser);
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
      var password = req.param('password');
      var userOptions = _.pick(_.pick(req.body,
        'username', 'email', 'group', 'userType'
      ), _.identity);

      var personOptions = _.pick(_.pick(req.body,
        'prefix', 'firstName', 'lastName', 'gender', 'dateOfBirth'
      ), _.identity);

      if (req.user.group !== 'admin') { // prevent all non-admin users from updating group
        delete userOptions.group;
      }

      Passport.findOne({ user : userId })
        .then(function (passport) {
          this.passport = passport;
          return User.findOne(userId);
        })
        .then(function (user) { // update user fields
          this.previousGroup = user.group;
          // compares the current password to the changed one, if different update expiredPassword
          if (!_.isEmpty(password)) {
            userOptions.expiredPassword = bcrypt.compareSync(password, this.passport.password);
          }
          return [
            User.update({id: user.id}, userOptions),
            Person.update({id: user.person}, personOptions)
          ];
        })
        .spread(function (user, person) { // updating group, apply new permissions
          this.user = user;
          if (this.previousGroup !== userOptions.group && req.user.group === 'admin') {
            return PermissionService.swapGroups(userId, this.previousGroup, userOptions.group);
          } else {
            return user;
          }
        })
        .then(function (user) { // updating group, apply new permissions
          this.user = _.first(user);
          if (this.previousGroup !== userOptions.group && req.user.group === 'admin') {
            return PermissionService.swapGroups(userId, this.previousGroup, userOptions.group);
          }
          return null;
        })
        .then(function(passport){ // updates the users passport and changes the email if there was a change
          if (!_.isEmpty(password) && this.passport) {
            return Passport.update(this.passport.id, { password: password });
          }
        })
        .then(function () {
          res.ok(this.user);
        })
        .catch(function (err) {
          res.badRequest(err);
        });
    }

  });
})();
