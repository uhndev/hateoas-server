/**
 * AuthController
 *
 * @module controllers/Auth
 * @description Controller used for handling authentication with server.
 *              Overrides sails-auth's AuthController to modify response
 *              to include populated group info like main/submenu settings
 *              for user as well as JWT token information.
 * @see https://github.com/tjwebb/sails-auth
 */

(function() {

  var _ = require('lodash');

  _.merge(module.exports, require('sails-permissions/api/controllers/AuthController'));
  _.merge(module.exports, {

    /**
     * Create a authentication callback endpoint (Overrides sails-auth)
     *
     * @param {Object} req request object
     * @param {Object} res response object
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

          var token = require('jsonwebtoken').sign(
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

            sails.log.info('user', resp.user, 'authenticated successfully');

            return res.json(resp);
          });
        });
      });
    }
  });
})();
