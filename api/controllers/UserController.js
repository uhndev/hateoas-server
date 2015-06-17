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
        role: req.param('role'),
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

  update: function (req, res) {
    // user params
    var userId = req.param('id');

    // access control params
    var centreAccess = req.param('centreAccess'),
        swapWith = req.param('swapWith'),
        isAdding = req.param('isAdding'),
        collectionCentres = req.param('collectionCentres');

    var userFields = {
      username: req.param('username'),
      email: req.param('email'),
      role: req.param('role'),
      centreAccess: centreAccess
    };

    if (req.user.role !== 'admin') {
      delete userFields.role;
    }

    var promise;
    /**
     * Update user and person model
     */
    if (userFields.username || userFields.email || userFields.role) {
      promise = User.update({id: userId}, userFields)
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
      });
    } 
    /**
     * Update user collection centre access
     */
    else {
      promise = User.findOne(userId).populate('collectionCentres')
      .then(function (user) { // update user's collection centre access
        this.user = user;
        if (req.user.role === 'admin') {
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
        if (req.user.role === 'admin' && !_.isUndefined(centreAccess)) {
          return User.update(userId, { centreAccess: centreAccess });
        }
        return this.user;
      });      
    }    
    
    promise.then(function (user) {
      res.ok(user);
    })
    .catch(function (err) {
      return res.serverError(err);
    });
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
