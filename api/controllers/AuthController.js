// api/controllers/AuthController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/AuthController');
var jwt = require('jsonwebtoken');

_.merge(exports, _super);
_.merge(exports, {

  /**
   * Create a authentication callback endpoint (Overrides sails-auth)
   * Needed to modify response to include populated group info like
   * main/submenu settings for user as well as JWT token information.
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

        User.findOne(user.id).populate('group')
        .then(function(data) {
          var userObj = _.pick(user, 'id', 'username', 'prefix', 'firstname', 'lastname');
          var resp = {
            user: userObj,
            group: {
              name: data.group.name,
              level: data.group.level,
              tabview: data.group.menu.tabview,
              subview: data.group.menu.subview
            },
            token: {
              payload: token,
              expires: sails.config.session.jwtExpiry
            }
          };

          // Upon successful login, optionally redirect the user if there is a
          // `next` query param
          if (req.query.next) {
            res.status(302).set('Location', req.query.next);
          }
          
          sails.log.info('user', resp, 'authenticated successfully');

          return res.json(resp);
        });        
      });
    });
  }   
});
