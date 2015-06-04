// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

_.merge(exports, _super);
_.merge(exports, {

  findOne: function (req, res, next) {
    User.findOne(req.param('id'))
      .populate('studies')
      .populate('person')
      .populate('roles')
    .exec(function (err, matchingRecord) {
      if (err) res.serverError(err);
      if(!matchingRecord) return res.notFound('No record found with the specified `id`.');

      if (matchingRecord.person) {
        _.merge(matchingRecord, Utils.User.extractPersonFields(matchingRecord.person));
        delete matchingRecord.person;
      }
      if (matchingRecord.roles) {
        matchingRecord.role = _.first(matchingRecord.roles).id;
        delete matchingRecord.roles;
      }
      res.ok(matchingRecord);
    });    
  },

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
    // user params
    var userId = req.param('id'),
        newUsername = req.param('username'),
        newEmail = req.param('email'),
        newPassword = req.param('password'),
        newRole = req.param('role');
    // person params
    var newPrefix = req.param('prefix'),
        newFirstname = req.param('firstname'),
        newLastname = req.param('lastname');
    // access control params
    var newCentreAccess = req.param('centreAccess'),
        swapWith = req.param('swapWith'),
        isAdding = req.param('isAdding'),
        newCollectionCentres = req.param('collectionCentres');

    var userFields = {}, personFields = {}, access = {};
    if (newUsername) userFields.username = newUsername;
    if (newEmail) userFields.email = newEmail;
    if (newCentreAccess) userFields.centreAccess = newCentreAccess;
    if (newCollectionCentres) userFields.collectionCentres = newCollectionCentres;
    if (newPrefix) personFields.prefix = newPrefix;
    if (newFirstname) personFields.firstname = newFirstname;
    if (newLastname) personFields.lastname = newLastname;

    PermissionService.getCurrentRole(req).then(function (role) {
      this.role = role;
      // only admins can make changes to centreAccess
      if (role !== 'admin') {
        delete userFields.centreAccess;
      }
      return User.findOne(userId).populate('collectionCentres');
    })
    .then(function (user) {  // update collectionCentres if needed
      this.user = user;
      if (newCollectionCentres && !_.isEqual(this.user.centreAccess, userFields.centreAccess)) {
        _.each(userFields.collectionCentres, function (centre) {
          if (isAdding) {
            this.user.collectionCentres.add(centre);  
          } else {
            this.user.collectionCentres.remove(centre);
          }          
        });

        // if swapping centres, isAdding flag will be false so after removing, add in new centres
        if (swapWith && swapWith.length > 0) {
          _.each(swapWith, function (centre) {
            this.user.collectionCentres.add(centre);       
          });
        }

        return this.user.save();
      }
      return user;
    })
    .then(function (user) {  // perform update on user model
      // only update collection centres via add/remove
      delete userFields.collectionCentres;
      return User.update(userId, userFields);
    })      
    .then(function (newUser) { // update password if needed
      if (newPassword) {
        Passport.findOne({
          user     : newUser[0].id
        }, function (err, passport) {
          if (err) res.serverError(err);
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
            // remove old roles only if admin
            if (this.role === 'admin') {
              _.each(this.previousRoles, function (prev) {
                this.user.roles.remove(prev.id);
              });          
              return [role, this.user.save()];  
            } else {
              return [role, this.user];
            }              
          })
          .spread(function (role, user) {
            // add new role
            if (this.role === 'admin') {
              this.user.roles.add(role.id);
              return this.user.save();
            } else {
              return this.user;
            }
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
    })
    .catch(function (err) {
      res.serverError(err);
    });
  },

  findByStudyName: function(req, res) {
    var studyName = req.param('name');
    PermissionService.getCurrentRole(req).then(function (roleName) {
      User.findByStudyName(studyName, roleName, req.user.id,
        { where: actionUtil.parseCriteria(req),
          limit: actionUtil.parseLimit(req),
          skip: actionUtil.parseSkip(req),
          sort: actionUtil.parseSort(req) }, 
        function(err, users) {
          if (err) res.serverError(err);
          res.ok(users);
        });    
    });    
  }
});
