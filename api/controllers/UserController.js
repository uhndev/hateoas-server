// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

_.merge(exports, _super);
_.merge(exports, {

  findOne: function (req, res, next) {
    User.findOne(req.param('id'))
      .populate('person')
      .populate('collectionCentres')
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
    var userId = req.param('id');

    // access control params
    var role = req.param('role'),
        centreAccess = req.param('centreAccess'),
        swapWith = req.param('swapWith'),
        isAdding = req.param('isAdding'),
        collectionCentres = req.param('collectionCentres');

    PermissionService.getCurrentRole(req).then(function (role) {
      this.role = role;
      var userFields = {
        username: req.param('username'),
        email: req.param('email')
      };

      if (userFields.username || userFields.email) {
        return User.update(userId, userFields).then(function (user) {
          return User.findOne(user[0].id).populate('roles');
        });  
      }
      return User.findOne(userId).populate('roles');
    })
    .then(function (updatedUser) {
      this.user = updatedUser;
      // remove old roles only if admin
      if (this.role === 'admin' && !_.isUndefined(role)) {
        _.each(this.user.roles, function (prev) {
          this.user.roles.remove(prev.id);
        });          
        return this.user.save();  
      } else {
        return this.user;
      }              
    })
    .then(function (updatedUser) {
      // add new role
      if (this.role === 'admin' && !_.isUndefined(role)) {
        this.user.roles.add(role);
        return this.user.save();
      } else {
        return this.user;
      }
    })
    .then(function (updatedUser) { // find and update user's associated passport
      if (!_.isEmpty(req.param('password'))) {
        return Passport.findOne({ user : updatedUser.id })
          .then(function (passport) {
            return Passport.update(passport.id, { password : req.param('password') });
          });
      }
    })
    .then(function (passport) { // update user's associated person
      var personFields = {
        prefix: req.param('prefix'),
        firstname: req.param('firstname'),
        lastname: req.param('lastname')
      };
      if (personFields.prefix || personFields.firstname || personFields.lastname) {
        if (!_.has(this.user, 'person')) {
          return Person.create(personFields).then(function (person) {
            return User.update(userId, { person: person.id });
          });
        } else {
          return Person.update(this.user.person, personFields);
        }  
      }
      return this.user;      
    })
    .then(function (user) {
      if (this.role === 'admin') {
        if (collectionCentres && !_.isEqual(this.user.centreAccess, centreAccess)) {
          _.each(collectionCentres, function (centre) {
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
      }      
      return this.user;
    })
    .then(function (user) {
      if (this.role === 'admin' && !_.isUndefined(centreAccess)) {
        return User.update(userId, { centreAccess: centreAccess });
      }
      return this.user;
    })
    .then(function (user) {
      res.ok(user);
    })
    .catch(function (err) {
      return res.serverError(err);
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
