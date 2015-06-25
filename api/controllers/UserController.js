// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

_.merge(exports, _super);
_.merge(exports, {

  find: function (req, res, next) {
    var query = User.find()
      .where( actionUtil.parseCriteria(req) )
      .limit( actionUtil.parseLimit(req) )
      .skip( actionUtil.parseSkip(req) )
      .sort( actionUtil.parseSort(req) );

    query.populate('roles');
    query.populate('person'); 
    query.exec(function found(err, users) {
      if (err) return res.serverError(err);

      _.map(users, function (user) {
        if (user.person) {
          _.merge(user, Utils.User.extractPersonFields(user.person));
          delete user.person;
        }
      });
      res.ok(users);
    });        
  },

  findOne: function (req, res, next) {
    User.findOne(req.param('id'))
      .populate('person')
      .populate('collectionCentres')
    .exec(function (err, matchingRecord) {
      if (err) res.serverError(err);
      if(!matchingRecord) {
        return res.notFound({
          title: 'Not Found',
          code: 404,
          message: 'No record found with the specified id.'
        });
      }

      if (matchingRecord.person) {
        _.merge(matchingRecord, Utils.User.extractPersonFields(matchingRecord.person));
        delete matchingRecord.person;
      }

      res.ok(matchingRecord);
    });    
  },

  // Overrides sails-auth's UserController.create to include role
  create: function (req, res, next) {
    var password = req.param('password');

    Person.create({
      prefix: req.param('prefix'),
      firstname: req.param('firstname'),
      lastname: req.param('lastname')
    }).exec(function (perr, person) {
      if (perr) res.serverError(perr);
      User.create({
        username: req.param('username'),
        email: req.param('email'),
        group: req.param('group'),
        person: person.id
      }).exec(function (uerr, user) {
        if (uerr || !user) {
          person.destroy(function (destroyErr) {
            return res.badRequest({
              title: 'User Error',
              code: 400,
              message: 'Error creating user'
            });  
          });
        } else {
          if (_.isEmpty(password)) {
            user.destroy(function (destroyErr) {
              person.destroy(function (destroyErr) {
                return res.badRequest({
                  title: 'User Error',
                  code: 400,
                  message: 'Password cannot be empty'
                });
              });                
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
        }          
      });
    });
  },

  /**
   * [update]
   * Route for handling update of user/person attributes     
   */
  update: function (req, res) {
    // user params
    var userId = req.param('id');

    var userFields = {
      username: req.param('username'),
      email: req.param('email'),
      group: req.param('group'),
      centreAccess: req.param('centreAccess')
    };

    Group.findOne(req.user.group).then(function (group) {
      this.group = group;
      if (group.level > 1) { // prevent all non-admin users
        delete userFields.group;
      }
      return User.findOne(userId).populate('roles');
    })
    .then(function (user) {
      this.previousGroup = user.group;
      return User.update({id: user.id}, userFields);
    })
    .then(function (user) { // find and update user's associated passport
      this.user = user;
      if (!_.isEmpty(req.param('password'))) {
        return Passport.findOne({ user : userId }).then(function (passport) {
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
    .then(function (user) { // updating group, apply new permissions
      if (this.previousGroup !== userFields.group && this.group.level === 0) {
        return PermissionService.setUserRoles(_.first(user));
      } else {
        return user;  
      }        
    })
    .then(function (user) {
      res.ok(user);
    })
    .catch(function (err) {
      res.serverError(err);
    });
  },

  /**
   * [updateAccess]
   * Route for handling collection centre access from study users page
   */
  updateAccess: function (req, res, next) {
    // user params
    var userId = req.param('id');

    // access control params
    var accessFields = {
      centreAccess: req.param('centreAccess'),
      swapWith: req.param('swapWith'),
      isAdding: req.param('isAdding'),
      collectionCentres: req.param('collectionCentres')
    };

    Group.findOne(req.user.group).then(function (group) {
      this.group = group;
      return User.findOne(userId).populate('collectionCentres');
    })
    .then(function (user) { // update user's collection centre access
      this.user = user;
      if (this.group.level === 1) {
        if (accessFields.collectionCentres && !_.isEqual(this.user.centreAccess, accessFields.centreAccess)) {
          _.each(accessFields.collectionCentres, function (centre) {
            if (accessFields.isAdding) {
              this.user.collectionCentres.add(centre);  
            } else {
              this.user.collectionCentres.remove(centre);
            }          
          });

          // if swapping centres, isAdding flag will be false so after removing, add in new centres
          if (accessFields.swapWith && accessFields.swapWith.length > 0) {
            _.each(accessFields.swapWith, function (centre) {
              this.user.collectionCentres.add(centre);       
            });
          }
          return this.user.save();
        }
      }      
      return this.user;
    })
    .then(function (user) {        
      if (this.group.level === 1 && !_.isUndefined(accessFields.centreAccess)) {
        return User.update(userId, { centreAccess: accessFields.centreAccess });
      }
      return this.user;
    })
    .then(function (user) {
      res.ok(user);
    })
    .catch(function (err) {
      res.serverError(err);
    });
  },

  /**
   * [updateRoles]
   * Route for handling role updates from access management page       
   */
  updateRoles: function (req, res, next) {
    // user params
    var userId = req.param('id');
    // access control params
    var roles = req.param('roles'),
        updateGroup = req.param('updateGroup');

    /**
    * Update user role from access management
    */    
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
    /**
     * Update user access matrix
     */
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

  findByStudyName: function(req, res) {
    var studyName = req.param('name');
    User.findByStudyName(studyName, req.user,
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