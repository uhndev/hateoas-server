// api/services/protocols/local.js

var _ = require('lodash');
var _super = require('sails-permissions/api/services/protocols/local');

function protocols () { }

protocols.prototype = Object.create(_super);
_.extend(protocols.prototype, {

  /**
   * Validate a login request
   *
   * Looks up a user using the supplied identifier (email or username) and then
   * attempts to find a local Passport associated with the user. If a Passport is
   * found, its password is checked against the password supplied in the form.
   *
   * @param {Object}   req
   * @param {string}   identifier
   * @param {string}   password
   * @param {Function} next
   */
  login: function (req, identifier, password, next) {
    var isEmail = Utils.User.validateEmail(identifier)
      , query   = {};

    if (isEmail) {
      query.email = identifier;
    }
    else {
      query.username = identifier;
    }

    sails.models.user.findOne(query, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(null, false);
      }

      sails.models.passport.findOne({
        protocol : 'local'
        , user     : user.id
      }, function (err, passport) {
        if (passport) {
          passport.validatePassword(password, function (err, res) {
            if (err) {
              return next(err);
            }

            if (!res) {
              return next(null, false);
            } else {
              return next(null, user, passport);
            }
          });
        }
        else {
          return next(null, false);
        }
      });
    });
  }

});

module.exports = new protocols();
