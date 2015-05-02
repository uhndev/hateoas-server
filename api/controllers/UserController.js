// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  // Overrides sails-auth's UserController.create to include role
  create: function (req, res) {
    var role = req.param('role');
    Role.findOne({name: role}).then(function (roleObj) {
      if (_.isUndefined(roleObj)) {
        return res.badRequest();
      } else {
        sails.services.passport.protocols.local.register(req.body, function (err, user) {
          if (err) return res.serverError(err);

          Promise.bind({}, User.findOne(user.id)
            .populate('roles')
            .then(function (user) {
              this.user = user;
              // console.log(this.user);
              return Role.findOne({ name: role });
            })
            .then(function (role) {
              this.user.roles.add(role.id);
              // console.log(this.user.roles);
              return this.user.save();
            })
            .then(function (updatedUser) {
              sails.log.silly('role ' + role + 'attached to user ' + this.user.username);
              res.ok(updatedUser);
            })
            .catch(function (err) {
              res.serverError(err);
            })
          );      
        });
      }
    });
  },

  update: function (req, res) {
    var userId = req.param('id'),
        newUsername = req.param('username'),
        newEmail = req.param('email'),
        newPassword = req.param('password'),
        newRole = req.param('role');

    var fields = {};
    if (newUsername) fields.username = newUsername;
    if (newEmail) fields.email = newEmail;

    User.update(userId, fields)
    .then(function (newUser) {
      if (newPassword) {
        Passport.findOne({
          user     : newUser[0].id
        }, function (err, passport) {
          if (err) res.serverError(err);
          // console.log(passport);
          Passport.update(passport.id, {
            password : newPassword
          }, function (err, passport) {
            if (err) res.serverError(err);
            return newUser;
          });
        });
      }
      return newUser;
    })
    .then(function (newUser) {
      if (newRole) {
        Promise.bind({}, User.findOne(userId)
          .populate('roles')  
          .then(function (user) {
            this.user = user;
            this.previousRoles = _.filter(this.user.roles, function(role) {
              return role.name !== 'registered';
            });
            return Role.findOne({ name: newRole });
          })
          .then(function (role) {
            // remove old roles
            _.each(this.previousRoles, function (prev) {
              this.user.roles.remove(prev.id);
            });          
            return [role, this.user.save()];
          })
          .spread(function (role, user) {
            // add new role
            this.user.roles.add(role.id);
            return this.user.save();
          })
          .then(function (updatedUser) {
            sails.log.silly('resole ' + newRole + 'attached to user ' + this.user.username);
            res.ok(this.user);
          })  
          .catch(function (err) {
            return res.serverError(err);
          })
        );
      } else {
        res.ok(newUser);  
      }      
    });
  },

  findByStudyName: function(req, res) {
    var studyName = req.param('name');

    User.findByStudyName(studyName,
      { where: actionUtil.parseCriteria(req),
        limit: actionUtil.parseLimit(req),
        skip: actionUtil.parseSkip(req),
        sort: actionUtil.parseSort(req) }, 
      function(err, users) {
        if (err) res.serverError(err);
        res.ok(users);
      });
  }
});
