// api/controllers/AuthController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/AuthController');
var jwt = require('jsonwebtoken');

_.merge(exports, _super);
_.merge(exports, {

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

        var token = jwt.sign(
          user, 
          sails.config.session.secret, 
          { expiresInMinutes: sails.config.session.jwtExpiry }
        );

        User.findOne(user.id).populate('roles').populate('person').populate('group')
        .then(function(data) {
          var resp = {
            id: user.id,
            username: user.username,
            group: data.group.name,
            level: data.group.level,
            tabview: data.group.menu.tabview,
            subview: data.group.menu.subview,
            token: token,
            expires: sails.config.session.jwtExpiry
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
