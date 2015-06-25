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
    function tryAgain (err) {
      // Only certain error messages are returned via req.flash('error', someError)
      // because we shouldn't expose internal authorization errors to the user.
      // We do return a generic error and the original request body.
      var flashError = req.flash('error')[0];
      if (err || flashError) {
        sails.log.warn(err);
        sails.log.warn(flashError);
      }

      if (err && !flashError ) {
        req.flash('error', 'Error.Passport.Generic');
      }
      else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      // If an error was thrown, redirect the user to the
      // login, register or disconnect action initiator view.
      // These views should take care of rendering the error messages.
      var action = req.param('action');

      if (action === 'register') {
        res.redirect('/register');
      }
      else if (action === 'login') {
        res.redirect('/login');
      }
      else if (action === 'disconnect') {
        res.redirect('back');
      }
      else {
        // make sure the server always returns a response to the client
        // i.e passport-local bad username/email or password
        res.forbidden();
      }
    }

    sails.services.passport.callback(req, res, function (err, user) {
      if (err || !user) {
        sails.log.warn(err);
        return tryAgain();
      }

      req.login(user, function (err) {
        if (err) {
          sails.log.warn(err);
          return tryAgain();
        }

        // Upon successful login, send the user to the homepage where req.user
        // will available.
        req.session.authenticated = true;

        User.findOne(user.id).populate('roles').populate('person').populate('group')
        .then(function(data) {
          var resp = {
            id: user.id,
            username: user.username,
            group: data.group.name,
            level: data.group.level,
            tabview: data.group.menu.tabview,
            subview: data.group.menu.subview
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
