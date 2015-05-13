// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

_.merge(exports, _super);
_.merge(exports, {

  // Overrides sails-auth's UserController.create to include role
  create: function (req, res, next) {
    var username = req.param('username'),
        email = req.param('email'),
        password = req.param('password'),
        role = req.param('role');
        prefix = req.param('prefix'),
        firstname = req.param('firstname'),
        lastname = req.param('lastname');

    Role.findOne(role).exec(function (err, role) {
      if (err || _.isUndefined(role)) {
        return res.badRequest(err); // role not found
      }

      Person.create({
        prefix: prefix,
        firstname: firstname,
        lastname: lastname
      }).exec(function (perr, person) {
        if (perr) res.serverError(perr);
        User.create({
          username: username,
          email: email,
          roles: [role],
          person: person.id
        }).exec(function (uerr, user) {
          if (uerr || !user) {
            person.destroy(function (destroyErr) {
              return res.badRequest(uerr);  
            });
          } else {
            Passport.create({
              protocol : 'local'
            , password : password
            , user     : user.id
            }, function (err, passport) {
              if (err) {
                user.destroy(function (destroyErr) {
                  person.destroy(function (destroyErr) {
                    next(destroyErr || err);  
                  });                
                });
              }
              res.ok(user);
            });            
          }          
        });
      });
    });
  },

  update: function (req, res) {
    var userId = req.param('id'),
        newUsername = req.param('username'),
        newEmail = req.param('email'),
        newPassword = req.param('password'),
        newRole = req.param('role');
        newPrefix = req.param('prefix'),
        newFirstname = req.param('firstname'),
        newLastname = req.param('lastname');

    var userFields = {}, personFields = {};
    if (newUsername) userFields.username = newUsername;
    if (newEmail) userFields.email = newEmail;
    if (newPrefix) personFields.prefix = newPrefix;
    if (newFirstname) personFields.firstname = newFirstname;
    if (newLastname) personFields.lastname = newLastname;

    User.update(userId, userFields)
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
        User.findOne(userId)
          .populate('roles')
          .populate('person')
          .then(function (user) {
            this.user = user;
            this.previousRoles = this.user.roles;
            return Role.findOne(newRole);
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
            sails.log.silly('role ' + newRole + 'attached to user ' + this.user.username);
            if (!this.user.person) {
              Person.create(personFields)
                .then(function (person) {
                  return person;
                })
                .then(function (person) {
                  User.update(this.user.id, { person: person.id }).exec(function (err, upduser) {
                    if (err) res.serverError(err);
                    res.ok(upduser);
                  });
                });
            } else {
              Person.update(this.user.person.id, personFields).exec(function (err, p) {
                if (err) res.serverError(err);
                res.ok(this.user);
              });
            }
          })  
          .catch(function (err) {
            return res.serverError(err);
          });
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
