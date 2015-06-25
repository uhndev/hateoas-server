// api/controllers/AuthController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/AuthController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.

  /**
   * Create a authentication callback endpoint (Overrides sails-auth)
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    sails.services.passport.callback(req, res, function (err, user) {
      if (err || !user) {
        sails.log.warn(err);
        return res.forbidden(err);
      }

      req.login(user, function (err) {
        if (err) {
          sails.log.warn(err);
          return res.forbidden(err);
        }

        // Upon successful login, send the user to the homepage where req.user
        // will available.
        req.session.authenticated = true;
        req.user = user;

        User.findOne(user.id).populate('roles').populate('person').populate('group')
        .then(function(data) {
          var resp = {
            id: user.id,
            username: user.username,
            group: data.group.name,
            level: data.group.level,
            tabview: data.group.menu.tabview,
            subview: data.group.menu.subview,
            token: SessionService.issueToken(req, {sid: user.id})
          };

          if (data.person) {
            _.merge(resp, Utils.User.extractPersonFields(data.person));
          }
          
          sails.log.info('user', resp, 'authenticated successfully');

          return res.json(resp);
        });        
      });
    });
  }   
});
