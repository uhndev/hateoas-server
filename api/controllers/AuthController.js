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

  _.merge(module.exports, require('sails-auth/dist/api/controllers/AuthController'));
  _.merge(module.exports, {

    /**
     * Log out a user and return them to the homepage
     *
     * Passport exposes a logout() function on req (also aliased as logOut()) that
     * can be called from any route handler which needs to terminate a login
     * session. Invoking logout() will remove the req.user property and clear the
     * login session (if any).
     *
     * For more information on logging out users in Passport.js, check out:
     * http://passportjs.org/guide/logout/
     *
     * @param {Object} req
     * @param {Object} res
     */
    logout: function (req, res) {
      req.logout();
      if (!req.isSocket) {
        res.send(200);
        // res.redirect(req.query.next || '/');
      }
      else {
        delete req.user;
        delete req.session.passport;
        req.session.authenticated = false;
        res.ok();
      }
    },

    /**
     * Create a authentication callback endpoint (Overrides sails-auth)
     *
     * @param {Object} req request object
     * @param {Object} res response object
     */
    callback: function (req, res) {
      // since we disabled sessions, we must also override req.flash
      req.flash = function(type, message) {
        var err = new Error(message);
        err.code = 400;
        return err;
      };

      sails.services.passport.callback(req, res, function (err, user) {
        if (err || !user) {
          sails.log.warn('err1', err);
          return res.forbidden(err);
        }

        req.login(user, function (err) {
          if (err) {
            sails.log.warn('err2', err);
            return res.forbidden(err);
          }

          var token = require('jsonwebtoken').sign(
            user,
            sails.config.session.secret,
            { expiresIn: sails.config.session.jwtExpiry }
          );

          User.findOne(user.id).exec(function (err, data) {
            var userObj = _.pick(user, 'id', 'username', 'prefix', 'firstname', 'lastname', 'group');
            var resp = {
              user: userObj,
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
