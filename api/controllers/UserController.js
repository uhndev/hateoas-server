// api/controllers/UserController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/UserController');
var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  // Overrides sails-auth's UserController.create to include role
  // create: function (req, res) {
  //   var role = req.param('role');
  //   sails.services.passport.protocols.local.register(req.body, function (err, user) {
  //     if (err) return res.serverError(err);

  //     Promise.bind({}, User.findOne(user.id)
  //       .populate('roles')
  //       .then(function (user) {
  //         this.user = user;
  //         console.log(this.user);
  //         return Role.findOne({ name: role });
  //       })
  //       .then(function (role) {
  //         this.user.roles.add(role.id);
  //         console.log(this.user.roles);
  //         return this.user.save();
  //       })
  //       .then(function (updatedUser) {
  //         sails.log.silly('role ' + role + 'attached to user ' + this.user.username);
  //         res.ok(updatedUser);
  //       })
  //       .catch(function (err) {
  //         res.serverError(err);
  //       })
  //     );      
  //   });
  // },

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
  },

  attachRole: function(req, res, next) {
    userId = req.param('id');
    role = req.param('role');
    Promise.bind({}, User.findOne(userId)
      .populate('roles')
      .then(function (user) {
        this.user = user;
        return Role.findOne({ name: role });
      })
      .then(function (role) {
        this.user.roles.add(role.id);
        return this.user.save();
      })
      .then(function (updatedUser) {
        sails.log.silly('role ' + role + 'attached to user ' + this.user.username);
        next();
      })
      .catch(next)
    );
  }
});
